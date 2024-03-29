import mimeTypes from "mime-types";
import { getCommonFormat } from "../formats";
import MeasureResult from "./MeasureResult";
import urijs from "urijs";
import path from "path";

/*
 * Tries to determine the format by downloading the downloadURL, and deciphering the MIME type
 * TODO not thouroughly unit tested
 */
export default function getMeasureResult(
    relatedDistribution: any,
    synonymObject: any
): MeasureResult {
    let { downloadURL } = relatedDistribution.aspects[
        "dcat-distribution-strings"
    ];

    if (!downloadURL || downloadURL === "") {
        downloadURL =
            relatedDistribution.aspects["dcat-distribution-strings"][
                "accessURL"
            ];
        if (!downloadURL || downloadURL === "") return null;
    }

    const downloadUrlPath = urijs(downloadURL ? downloadURL : "").pathname();
    const extname = path.extname(downloadUrlPath);
    if (!extname) {
        return null;
    }
    const rawMime: string | false = mimeTypes.lookup(extname);

    if (!rawMime) {
        return null;
    }

    const processedMime: string = rawMime.split("/")[1];
    return {
        formats: [
            {
                format: getCommonFormat(processedMime, synonymObject),
                correctConfidenceLevel: 100
            }
        ],
        distribution: relatedDistribution
    };
}
