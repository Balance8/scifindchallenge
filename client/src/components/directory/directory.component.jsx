import React from 'react';

import MenuItem from '../menu-item/menu-item.component';
import DIRECTORY_DATA from './directory.data.js';

import { DirectoryMenuContainer } from './directory.styles';

//rework to match with db

export const Directory = ({ sections }) => (
  <DirectoryMenuContainer>
    {DIRECTORY_DATA.map(({ id, ...otherSectionProps }) => (
      <MenuItem key={id} {...otherSectionProps} />
    ))}
  </DirectoryMenuContainer>
);

export default Directory;