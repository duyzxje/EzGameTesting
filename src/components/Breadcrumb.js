export function createBreadcrumb(paths) {
  return paths.map((path, index) => {
    const isLast = index === paths.length - 1;
    if (isLast) {
      return `<span class="current">${path.name}</span>`;
    } else {
      return `
        <a href="${path.link}">${path.name}</a>
        <span class="separator">/</span>
      `;
    }
  }).join('');
}
