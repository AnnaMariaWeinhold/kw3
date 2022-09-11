#!/bin/bash

cd de/images

# Replace all occurences of "png" in order to convert another input format to webp
JPEG=$(ls | grep '.png')

# echo $JPEG
NEW_EXT="webp"

for FILE in $JPEG
do
  echo "Processing: $FILE"
  cwebp $FILE -o ${FILE/.png/.$NEW_EXT}
  echo ${FILE/.png/.$NEW_EXT}
done