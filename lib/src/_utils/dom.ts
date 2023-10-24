export const updateTag = (
  tagName: string,
  keyName: string,
  keyValue: string,
  attrName: string,
  attrValue: string,
) => {
  const titleElem = document.head.querySelector('title');
  const metaElem = document.head.querySelector(
    `${tagName}[${keyName}="${keyValue}"]`,
  );

  // Удаляем элемент
  if (metaElem) {
    metaElem.parentNode.removeChild(metaElem);
  }

  // Затем добавляем снова для сохранения порядка
  if (titleElem && typeof attrValue === 'string') {
    const newMetaElem = document.createElement(tagName);
    newMetaElem.setAttribute(keyName, keyValue);
    newMetaElem.setAttribute(attrName, attrValue);

    // Всегда вставляем после title
    titleElem.parentNode.insertBefore(newMetaElem, titleElem.nextSibling);
  }
};

export const updateMeta = (name: string, content: string) => {
  updateTag('meta', 'name', name, 'content', content);
};

export const updateCustomMeta = (property: string, content: string) => {
  updateTag('meta', 'property', property, 'content', content);
};

export const updateLink = (rel: string, href: string) => {
  updateTag('link', 'rel', rel, 'href', href);
};
