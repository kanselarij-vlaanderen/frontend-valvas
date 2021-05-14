export default function (mandateType) {
  if (mandateType === 'minister') {
    return 3;
  } else if (mandateType === 'viceminister-president') {
    return 2;
  } else if (mandateType === 'minister-president') {
    return 1;
  } else {
    return 4;
  }
}
