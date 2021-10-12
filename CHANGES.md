> The repo was part of [magda main repo](https://github.com/magda-io/magda). For history before v1.0.0, please check [CHANGES.md of main repo](https://github.com/magda-io/magda/blob/master/CHANGES.md).

# 1.1.0

-   Related to https://github.com/magda-io/magda/issues/3229, Use magda-common for docker image related logic

# 1.0.1

-   #14 Fixed: TypeError: Cannot read property 'trim' of null when processing invalid metadata
-   #16 Should recognise ZIP or other format file stored on ESRI portal correctly

# 1.0.0

-   #8 Better GeoSpatial API format categorising
-   #11 Use format info in original metadata if it is "CSV-GEO-AU"
-   #12 Recognise zipped GeoTiff file as GeoTiff format
-   Increase default memory to 50mb
-   Use Chart.version as default image version
-   Upgrade CI scripts
-   Make ArcGIS FeatureServer format as FEATURESERVER
