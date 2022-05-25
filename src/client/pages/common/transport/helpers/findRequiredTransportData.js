import _ from 'lodash';

function hasExportPayload(props) {
    return !_.isEmpty(props.exportLocation);
}

function hasStorageFacilities(props) {
    if (props.storageNotes === undefined)
        return false;
        
    return !_.isEmpty(props.storageNotes.storageFacilities);
}

export { hasExportPayload as catchCertificate };
export { hasStorageFacilities as storageNotes };