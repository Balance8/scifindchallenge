import React from 'react';
import { withRouter } from 'react-router-dom';

import { default as CollectionItem } from '../collection-item/collection-item.container';

import {
  CollectionPreviewContainer,
  TitleContainer,
  PreviewContainer,
} from './collection-preview.styles';

export const CollectionPreview = ({ title, items, history, match }) => (
  <CollectionPreviewContainer>
    <TitleContainer
      onClick={() => history.push(`${match.path}/${title.toLowerCase()}`)}
    >
      {title.toUpperCase()}
    </TitleContainer>
    <PreviewContainer>
      {items
        .filter((item, idx) => idx < 4)
        .map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
    </PreviewContainer>
  </CollectionPreviewContainer>
);

export default withRouter(CollectionPreview);
