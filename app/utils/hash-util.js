import VRDocumentName from 'frontend-valvas/utils/vr-document-name';

export function setHash(name) {
  const vrDoc = new VRDocumentName(name);
  const shortName = vrDoc.vrNumberWithSuffix()
                         .replaceAll(' ', '-')
                         .replaceAll('/', '-');
  window.location.replace(`#${shortName}`);
}
