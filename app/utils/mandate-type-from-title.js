const regexVlaamseMinister = /^(VM van)|(Vlaams minister van).*/i;
const regexMinisterPresident = /^(Minister-president).*/i;
const regexViceministerPresident = /^(viceminister-president).*/i;

export default function (title) {
  let fmtTitle = title || '';
  if (regexVlaamseMinister.test(fmtTitle)) return 'minister';
  else if (regexViceministerPresident.test(fmtTitle))
    return 'viceminister-president';
  else if (regexMinisterPresident.test(fmtTitle)) return 'minister-president';
  else return '';
}
