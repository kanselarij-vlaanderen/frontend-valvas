export function setHash(name) {
  const shortName = name.substring(0, name.search(/-\d+\s/) + name.match(/-\d+\s/)[0].length).trim();
  const shortNameWithDashes = shortName.replaceAll(" ", "-");
  window.location.hash = shortNameWithDashes;
}