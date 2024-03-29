import MeasureEvaluationSet from "./measures/MeasureEvaluationSet";
//import MeasureResult from "./measures/MeasureResult";
import MeasureEvalResult from "./MeasureEvalResult";

/**
 * Evaluates the best MeasureEvalResult
 */
export default function getBestMeasureResult(
    candidates: MeasureEvaluationSet[]
): MeasureEvalResult {
    if (!candidates || candidates.length < 1) {
        return null;
    }

    const dcatSet = candidates[0];

    let sortedCandidates = candidates.sort(candidateSortFn);

    //TODO produce a system that mitigates when all measures return null. What should happen then?
    if (!sortedCandidates[0].measureResult) {
        return null;
    } else {
        let finalCandidate = sortedCandidates[0];
        if (dcatSet.measureResult) {
            const sortedFormat = (
                "" + sortedCandidates[0].measureResult.formats[0].format
            )
                .trim()
                .toUpperCase();
            const dcatFormat = ("" + dcatSet.measureResult.formats[0].format)
                .trim()
                .toUpperCase();

            if (
                /**
                 * if sortedFormat is `ZIP` & is different from dcatFormat, we should trust dcatFormat
                 * However, if dcatFormat is "esri", likely a zip resource hosted on esri portal.
                 * Thus, should keep as ZIP
                 */
                sortedFormat === "ZIP" &&
                dcatFormat !== sortedFormat &&
                dcatFormat.indexOf("ESRI") === -1
            ) {
                finalCandidate = dcatSet;
            }

            // if format get from original metadata is "WMS" or "WFS", we should trust it
            if (
                ["WMS", "WFS"].indexOf(dcatFormat) !== -1 &&
                dcatFormat !== sortedFormat
            ) {
                finalCandidate = dcatSet;
            }

            // if format get from original metadata is "CSV-GEO-AU", we should trust it
            if (dcatFormat === "CSV-GEO-AU" && dcatFormat !== sortedFormat) {
                finalCandidate = dcatSet;
            }
        }
        return {
            format: finalCandidate.measureResult.formats[0],
            absConfidenceLevel: finalCandidate.getProcessedData()
                .absoluteConfidenceLevel
        };
    }
}

//TODO simplify this function
function candidateSortFn(
    candidate1: MeasureEvaluationSet,
    candidate2: MeasureEvaluationSet
) {
    if (candidate1.measureResult && !candidate2.measureResult) {
        return -1;
    } else if (candidate2.measureResult && !candidate1.measureResult) {
        return 1;
    } else if (
        candidate1.getProcessedData().absoluteConfidenceLevel ===
        candidate2.getProcessedData().absoluteConfidenceLevel
    ) {
        return 0;
    } else if (
        candidate1.getProcessedData().absoluteConfidenceLevel <
        candidate2.getProcessedData().absoluteConfidenceLevel
    ) {
        return 1;
    } else {
        return -1;
    }
}
