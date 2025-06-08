# Grand Theft Auto(III, VC, SA) img-archive reader.
[![npm](https://img.shields.io/npm/v/rw-img-reader.svg)](https://www.npmjs.com/package/rw-img-reader)
[![NPM](https://img.shields.io/npm/l/rw-img-reader.svg)](https://github.com/AnriTool/RwIMGReader/blob/main/LICENSE)

Allows you to get data from GTA [III, VC, SA] img archive

## Example

### GTA SA Features
GTA SA does not have a .dir archive, it is included inside the .img. You can put one buffer in both loadDIR and loadIMG methods
```ts
const resource = readFileSync('./assets/gta3.img').buffer;
imgReader.loadDIR(resource);
imgReader.loadIMG(resource);
```
### console example(without browser)
save infernus.txd + infernus.dff
```ts
import {ImgReader} from './ImgReader'
import {readFileSync, writeFileSync} from 'fs';

const imgReader = new ImgReader();
imgReader.loadDIR(readFileSync('./assets/gta3.dir').buffer);
imgReader.loadIMG(readFileSync('./assets/gta3.img').buffer);

for (const asset of imgReader.getAssetList()) {
	if (asset.name.includes('infernus')) {
		// save file
		writeFileSync('./assets/unpacked/' + asset.name , Buffer.from(imgReader.loadAsset(asset)))
	}
}
```

### Browser example
write all resources in browser console
```ts
import {ImgReader} from './ImgReader'

async function example() {
	const imgReader = new ImgReader();

	const dirResource = ((await fetch('http://localhost:5173/gta3.dir')).arrayBuffer());
	imgReader.loadDIR(await dirResource);

	const imgResource = (await fetch('http://localhost:5173/gta3.img')).arrayBuffer();
	imgReader.loadIMG(await imgResource);

	console.log(imgReader.getAssetList())
}

example();
```

## using with [rw-parser](https://github.com/Timic3/rw-parser)
```ts
for (const asset of imgReader.getAssetList()) {
	if (asset.name.includes('infernus')) {

		if (asset.name.includes('.dff')) {
			const dffParser = new DffParser(Buffer.from(imgReader.loadAsset(asset)))
			console.log(dffParser.parse());
		}

		if (asset.name.includes('.txd')) {
			const txdParser = new TxdParser(Buffer.from(imgReader.loadAsset(asset)))
			console.log(txdParser.parse());
		}
	}
}
```