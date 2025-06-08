// Based on https://github.com/magcius/noclip.website/blob/main/src/GrandTheftAuto3/tools/extractor.ts

export interface Asset {
	offset: number;
	size: number;
	name: string;
}

export class ImgReader {
	protected assets: Asset[]  = [];
	protected img: ArrayBuffer = new ArrayBuffer;

	protected UTF8ToString(array: Uint8Array): string {
		let length = 0;
		while (length < array.length && array[length]) {
			length++;
		}

		return (new TextDecoder()).decode(array.subarray(0, length));
	}

	public loadDIR(buf: ArrayBuffer): void {
		let assets: Asset[] = [];
		let view            = new DataView(buf);
		let byteLength      = buf.byteLength;

		// if "VER2" - in fist 4 bytes => this is SA .img archive
		const isSa = ('VER2' === this.UTF8ToString(new Uint8Array(buf, 0, 4)));

		if (isSa) {
			// second 4 bytes - Number Of Entries in archive
			byteLength = (32 * view.getUint32(4, true)) + 8;
		}

		// in SA: 4 bytes = "VER2" + 4 bytes = Number Of Entries
		for (let i = (isSa ? 8 : 0); i < byteLength; i += 32) {
			const offset = view.getUint32(i, true);
			const size   = view.getUint32(i + 4, true);
			const name   = this.UTF8ToString(new Uint8Array(buf, i + 8, 24));
			assets.push({ offset, size, name });
		}

		this.assets = assets;
	}

	public loadIMG(imgFileBuffer: ArrayBuffer): void {
		this.img = imgFileBuffer;
	}

	public getAssetList(): Asset[] {
		return this.assets;
	}

	public loadAsset(asset: Asset): ArrayBuffer {
		return this.img.slice(2048 * asset.offset, 2048 * (asset.offset + asset.size));
	}
}