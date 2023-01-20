export type OCRResponse = Cell[][][];
export interface Cell {
	BoundingBox: BoundingBox;
	ColumnIndex: number;
	Polygon: Coordinate[];
	RowIndex: number;
	Page: number;
    Text: string;
    children: Block[];
}
interface Block {
  BlockType: string;
  Confidence: number;
  Geometry: Geometry;
  Id: string;
  Page: number;
  Text: string;
  TextType: string;
}

interface Geometry {
  BoundingBox: BoundingBox;
  Polygon: Coordinate[];
}


export interface BoundingBox {
	Height: number;
	Left: number;
	Top: number;
	Width: number;
}
export interface Coordinate {
	X: number;
	Y: number;
}

export interface IReduxPDF {
	url: string;
	fileName: string;
	ocr: OCRResponse;
}

export interface IRoot {
	pdf: IReduxPDF;
}

export interface IStudentRecord {
	'Roll No': string;
	'Student Name': string;
	'Enrollment No.': string;
	'Present/Absent': string;
}