// Based on https://github.com/magcius/noclip.website/blob/main/src/GrandTheftAuto3/tools/extractor.ts

export interface Asset {
	offset: number;
	size: number;
	name: string;
}

export class ImgReader {
	protected assets: Map<string, Asset>  = new Map();
	protected img: Uint8Array             = new Uint8Array(0);

	protected UTF8ToString(array: Uint8Array): string {
		let length = 0;
		while (length < array.length && array[length]) {
			length++;
		}

		return (new TextDecoder()).decode(array.subarray(0, length));
	}

	public loadDIR(dirBuffer: ArrayBuffer): void {
		const buf      = new Uint8Array(dirBuffer);
		let view       = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
		let byteLength = buf.byteLength;

		// if "VER2" - in fist 4 bytes => this is SA .img archive
		const isSa = ('VER2' === this.UTF8ToString(buf.subarray(0, 4)));

		if (isSa) {
			// second 4 bytes - Number Of Entries in archive
			byteLength = (32 * view.getUint32(4, true)) + 8;
		}

		// in SA: 4 bytes = "VER2" + 4 bytes = Number Of Entries
		for (let i = (isSa ? 8 : 0); i < byteLength; i += 32) {
			const offset = view.getUint32(i, true);
			const size   = view.getUint32(i + 4, true);
			const name   = this.UTF8ToString(buf.subarray(i + 8, i + 32));
			this.assets.set(name, { offset, size, name});
		}
	}

	public loadIMG(imgFileBuffer: ArrayBuffer): void {
		this.img = new Uint8Array(imgFileBuffer);
	}

	public getAssetList(): Asset[] {
		return Array.from(this.assets.values());
	}

	public getAssetByName(name: string): Asset | undefined {
		return this.assets.get(name);
	}

	public loadAsset(asset: Asset): Uint8Array {
		return this.img.subarray(2048 * asset.offset, 2048 * (asset.offset + asset.size))
	}
}