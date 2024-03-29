import {} from "mocha";
import { expect } from "chai";
import sinon from "sinon";
import onRecordFound from "../onRecordFound";

import launcestonDist2 from "./sampleDataFiles/launceston-dist-2.json";
import launcestonDist7 from "./sampleDataFiles/launceston-dist-7.json";
import launcestonDist8 from "./sampleDataFiles/launceston-dist-8.json";

import aodnDist1 from "./sampleDataFiles/aodn-dist-1.json";
import aodnDist2 from "./sampleDataFiles/aodn-dist-2.json";
import aodnDist3 from "./sampleDataFiles/aodn-dist-3.json";
import aodnDist4 from "./sampleDataFiles/aodn-dist-4.json";
import aodnDist5 from "./sampleDataFiles/aodn-dist-5.json";
import aodnDist6 from "./sampleDataFiles/aodn-dist-6.json";

import dapDist1 from "./sampleDataFiles/dap-dist-1.json";
import dapDist28 from "./sampleDataFiles/dap-dist-28.json";

import dgaDistSpss from "./sampleDataFiles/dga-dist-spss.json";
import dsaDistCsv from "./sampleDataFiles/dsa-dist-csv.json";

import failingDocs from "./sampleDataFiles/failing-docs.json";

import ascGridDist from "./sampleDataFiles/asc-grid-dist.json";

import soilRiskMap1 from "./sampleDataFiles/soil-risk-map-1.json";

import soilRiskMap2 from "./sampleDataFiles/soil-risk-map-2.json";

import { AuthorizedRegistryClient as Registry } from "@magda/minion-sdk";

describe("onRecordFound", async function(this) {
    async function testDistReturnsFormat(
        distributionData: any,
        format: string
    ) {
        let resultAspect: any;
        const registry = sinon.createStubInstance(Registry);
        registry.putRecordAspect.callsFake(
            (disId: any, aType: any, aspect: any) => {
                resultAspect = aspect;
                return Promise.resolve({} as any);
            }
        );

        await onRecordFound(distributionData, registry as any);

        expect(resultAspect).to.include({
            format
        });
    }

    function testDistFileReturnsFormat(
        distributionDataFile: string,
        format: string
    ) {
        const data = require(distributionDataFile);
        it(`Should process "${distributionDataFile}" as "${format}"`, () =>
            testDistReturnsFormat(data, format));
    }

    describe("Should process sample launceston dataset data correctly", function() {
        it("Should return `ESRI MAPSERVER` for distribution no. 2", () => {
            return testDistReturnsFormat(launcestonDist2, "ESRI MAPSERVER");
        });

        it("Should return `WMS` for distribution no.7", () => {
            return testDistReturnsFormat(launcestonDist7, "WMS");
        });

        it("Should return `WFS` for distribution no.8", () => {
            return testDistReturnsFormat(launcestonDist8, "WFS");
        });
    });

    describe("Should process sample aodn distributions correctly", function() {
        it("Should process 1st distribution as `HTML`", () => {
            return testDistReturnsFormat(aodnDist1, "HTML");
        });

        it("Should process 2nd distribution dcat format string `WWW:DOWNLOAD-1.0-http--csiro-oa-app` as `CSIRO Open APP`", () => {
            return testDistReturnsFormat(aodnDist2, "CSIRO OPEN APP");
        });

        it("Should process 3rd distribution as `PDF`", () => {
            return testDistReturnsFormat(aodnDist3, "PDF");
        });

        it("Should process 4th distribution as `HTML`", () => {
            return testDistReturnsFormat(aodnDist4, "HTML");
        });

        it("Should process 5th distribution as `HTML`", () => {
            return testDistReturnsFormat(aodnDist5, "HTML");
        });

        it("Should process 6th distribution as `HTML`", () => {
            return testDistReturnsFormat(aodnDist6, "HTML");
        });
    });

    describe("Should process sample DAP dataset correctly", function() {
        it("Should process `application/pdf` (1st distribution) as `PDF`", () => {
            return testDistReturnsFormat(dapDist1, "PDF");
        });

        it("Should process 1image/svg+xml` (28th distribution) as `SVG`", () => {
            return testDistReturnsFormat(dapDist28, "SVG");
        });
    });

    it("Should process SPSS .sav file as SPSS", () => {
        return testDistReturnsFormat(dgaDistSpss, "SPSS");
    });

    it("Should a dataset with the format '.csv' correctly even if the file doesn't have a csv extension", () => {
        return testDistReturnsFormat(dsaDistCsv, "CSV");
    });

    it("Dataset's dcat format should be trust if other measures report it as a ZIP", () => {
        return testDistReturnsFormat(ascGridDist, "ASC");
    });

    describe("Should process soil risk map dataset correctly", function() {
        it("Should process (1st distribution) as `WFS` rather than `ESRI`", () => {
            return testDistReturnsFormat(soilRiskMap1, "WFS");
        });

        it("Should process (2nd distribution) as `WMS` rather than `ESRI`", () => {
            return testDistReturnsFormat(soilRiskMap2, "WMS");
        });
    });

    testDistFileReturnsFormat("./sampleDataFiles/esri-zip.json", "ZIP");

    testDistFileReturnsFormat("./sampleDataFiles/esri-pdf.json", "PDF");

    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-rest-map-server.json",
        "ESRI MAPSERVER"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-featureserver.json",
        "ESRI FEATURESERVER"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-sceneserver.json",
        "ESRI SCENESERVER"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-sceneserver2.json",
        "ESRI SCENESERVER"
    );

    // we put as ESRI MAPSERVER for now see https://github.com/magda-io/magda-minion-format/issues/8
    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-featureserver-group1.json",
        "ESRI FEATURESERVER"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/esri-featureserver-group2.json",
        "ESRI FEATURESERVER"
    );

    testDistFileReturnsFormat("./sampleDataFiles/GeoTIFF-zip.json", "GEOTIFF");

    testDistFileReturnsFormat(
        "./sampleDataFiles/csv-geo-au.json",
        "CSV-GEO-AU"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/test-basic-format.json",
        "HTML"
    );

    testDistFileReturnsFormat(
        "./sampleDataFiles/issue-23-geojson.json",
        "GEOJSON"
    );

    /**
     * This test simply takes a bunch of formats that were previously causing the minion to use all its CPU and be
     * killed by a liveness check and ensures that they all are able to execute in less than 5 seconds.
     */
    describe("should process formats in a timely manner", () => {
        for (const failingDoc of (failingDocs as any) as any[]) {
            it(`for ${failingDoc.description}`, () => {
                const registry = sinon.createStubInstance(Registry);
                registry.putRecordAspect.callsFake(
                    (disId: any, aType: any, aspect: any) => {
                        return Promise.resolve({} as any);
                    }
                );

                const input = {
                    id: failingDoc.description,
                    name: failingDoc.description,
                    aspects: {
                        "dcat-distribution-strings": failingDoc
                    }
                } as any;

                const promise = onRecordFound(input, registry as any);

                return promise;
            }).timeout(5000);
        }
    });
});
