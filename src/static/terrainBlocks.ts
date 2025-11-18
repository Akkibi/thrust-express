interface terrainBlocksType {
  straight: blockType;
  corners: blockType;
}

type blockType = string[];

export const terrainBlocks: terrainBlocksType = {
  straight: [],
  corners: [],
};
