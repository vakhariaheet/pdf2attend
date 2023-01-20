import React, { useEffect, useRef, useState } from 'react';
import './OCRPDF.scss';
import data from '../../data/result.json';
import { io, Socket } from 'socket.io-client';
import { Cell, IRoot, IStudentRecord, OCRResponse } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import { clearPDF, updateOCR } from '../../Slices/Pdf.slice';
import ApiService from '../../utils/ApiService';
import { useNavigate } from 'react-router-dom';
import PopUp from '../../Components/PopUp/PopUp';

export interface OCRPDFProps {}
const socket = io(import.meta.env.VITE_API_URL);
const OCRPDF: React.FC<OCRPDFProps> = () => {
	const pdf = useSelector((state: IRoot) => state.pdf);
	const [pageNumber, setPageNumber] = React.useState(1);
	const [scale, setScale] = useState(1);
	const [pdfInfo, setPdfInfo] = React.useState<{
		height: number;
		width: number;
	} | null>(null);
	const [showPopUp, setShowPopUp] = useState(false);
	const url = useRef<string>(pdf.url);
	const pdfDoc = useRef<any>(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const createExel = async () => {
		const tableData: IStudentRecord[] = [];
		data.forEach((page) => {
			page.forEach((row: any) => {
				let student: IStudentRecord = {
					'Roll No': '',
					'Student Name': '',
					'Enrollment No.': '',
					'Present/Absent': '',
				};
				let isInvalidRow = false;
				if (row) {
					isInvalidRow = !Boolean(row[0]?.Text.match(/[0-9]/g));
					const division = row[0]?.Text.match(/[A-Z]/)?.join('');
					const rollNo = row[0]?.Text.match(/[0-9]/g)?.join('');
					student = {
						'Roll No': `${division}${rollNo}`,
						'Student Name': row[1]?.Text,
						'Enrollment No.': row[2]?.Text,
						'Present/Absent': row[3]?.Text,
					};
				}
				if (!isInvalidRow) tableData.push(student);
			});
		});
		const response = await ApiService.post<{ s3: string }>('create-xlsx', {
			data: tableData,
		});
		const url = response.data.s3;
		const a = document.createElement('a');
		a.href = url;

		a.download = 'result.xlsx';
		a.click();

		// URL.revokeObjectURL(url);
	};
	useEffect(() => {
		console.log('pdf changed', scale);
	}, [scale]);
	return (
		<div className=' flex flex-col items-center gap-4'>
			<div className='flex relative justify-center'>
				<div className='relative flex pdf-container'>
					<Document
						file={pdf.url}
						ref={pdfDoc}
						onLoadSuccess={(pdf) => {
							pdf.getPage(1).then((page) => {
								setPdfInfo({
									height: page.view[3],
									width: page.view[2],
								});
							});
						}}
					>
						<Page
							pageNumber={pageNumber}
							height={700}
							
							onLoadSuccess={(page) => {
								setPdfInfo({
									height: page.view[3],
									width: page.view[2],
								});
							}}
						/>
					</Document>
					<button
						className='absolute top-[1rem] right-[1rem] cursor-pointer z-[2] h-[1.5rem] w-[1.5rem] rounded-full flex justify-center items-center shadow-md  transition-all bg-white'
						onClick={(e) => {
							setShowPopUp(true);
						}}
					>
						<svg viewBox='0 0 128 128'>
							<path
								d='m122.732 10.606-.002 26.701a5.337 5.337 0 1 1-10.675-.001v-13.8L81.036 54.552a5.322 5.322 0 0 1-3.779 1.564 5.337 5.337 0 0 1-3.776-9.111l31.029-31.059H90.713a5.34 5.34 0 0 1 0-10.68h26.679c1.417 0 2.774.563 3.776 1.566a5.338 5.338 0 0 1 1.564 3.774zm-5.339 74.746a5.34 5.34 0 0 0-5.338 5.341v13.8L81.556 74.254c-2.087-2.085-5.61-2.087-7.695-.002-2.086 2.082-2.158 5.464-.075 7.548l30.191 30.254H90.154a5.342 5.342 0 0 0-5.343 5.339 5.335 5.335 0 0 0 5.335 5.338l26.675.003c1.418 0 3.062-.563 4.061-1.564 1.001-1.001 1.851-2.359 1.851-3.774V90.692a5.343 5.343 0 0 0-5.34-5.34zM46.442 74.019l-30.496 30.476V90.692c0-2.949-2.343-5.334-5.291-5.334h.022a5.327 5.327 0 0 0-5.328 5.334l.002 26.7a5.342 5.342 0 0 0 5.345 5.34h26.68a5.34 5.34 0 0 0 0-10.68H23.583l30.458-30.486c2.087-2.084 2.06-5.469-.025-7.551s-5.488-2.08-7.574.004zM23.489 16.427h13.795a5.34 5.34 0 0 0 0-10.677l-26.677-.002h-.001A5.34 5.34 0 0 0 6.83 7.309a5.342 5.342 0 0 0-1.563 3.777l.003 26.702a5.34 5.34 0 0 0 5.338 5.339 5.34 5.34 0 0 0 5.338-5.339V23.986l30.776 30.801a5.324 5.324 0 0 0 3.778 1.566 5.34 5.34 0 0 0 3.776-9.116z'
								fill='#000000'
							/>
						</svg>
					</button>
					<svg
						preserveAspectRatio='xMinYMin meet'
						className='absolute top-0 left-0'
						viewBox={`0 0 ${pdfInfo?.width} ${pdfInfo?.height}`}
					>
						{pdf.ocr[pageNumber - 1].map((row, index) => {
							return row.map((cell) => {
								if (!cell || !pdfInfo) return <></>;

								return cell.children?.map((child, index) => {
									if (!child) return <></>;
									if (!child.Geometry) return <></>;
									const coords = child.Geometry.Polygon;
									const pdfWidth = pdfInfo.width;
									const pdfHeight = pdfInfo.height;
									const points = coords.map((coord: any) => {
										return `${coord.X * pdfWidth},${coord.Y * pdfHeight}`;
									});
									if (index === cell.children?.length - 1) {
										// Add a second polygon for checkbox aside last polygon of a cell of size 10px x 10px
										return (
											<>
												<polygon
													points={points.join(' ')}
													fill='rgba(0,0,0,0.3)'
												/>
											</>
										);
									}
									return (
										<polygon points={points.join(' ')} fill='rgba(0,0,0,0.3)' />
									);
								});
							});
						})}
					</svg>
					<div className='file-info absolute gap-2 justify-center w-full  flex text-center bottom-[.5rem] p-2 opacity-0   transition-all text-sm'>
						<button
							onClick={(e) =>
								setPageNumber(pageNumber !== 1 ? pageNumber - 1 : pageNumber)
							}
							disabled={pageNumber === 1}
							className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
						>
							<svg viewBox='0 0 492.004 492.004' className='w-4 h-4 rotate-180'>
								<path
									d='M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
			c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
			c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
			c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z'
									fill='#000000'
									data-original='#000000'
								/>
							</svg>
						</button>
						<button
							onClick={(e) =>
								setPageNumber(
									pdf.ocr.length !== pageNumber ? pageNumber + 1 : pageNumber,
								)
							}
							className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
							disabled={pdf.ocr.length === pageNumber}
						>
							<svg viewBox='0 0 492.004 492.004' className='w-4 h-4 '>
								<path
									d='M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
			c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
			c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
			c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z'
									fill='#000000'
									data-original='#000000'
								/>
							</svg>
						</button>
					</div>
				</div>
				{showPopUp && (
					<PopUp>
						<div className='relative flex pdf-container max-h-[100vh] max-w-[100vw] zoom-container overflow-scroll'>
							<div className='flex justify-center '>
								<Document
									file={pdf.url}
									ref={pdfDoc}
									onLoadSuccess={(pdf) => {
										pdf.getPage(1).then((page) => {
											setPdfInfo({
												height: page.view[3],
												width: page.view[2],
											});
										});
									}}
								>
									<Page
										pageNumber={pageNumber}
										scale={scale}
										onLoadSuccess={(page) => {
											setPdfInfo({
												height: page.view[3],
												width: page.view[2],
											});
										}}
									/>
								</Document>

								<svg
									preserveAspectRatio='xMinYMin meet'
									className='absolute top-0 left-0'
									viewBox={`0 0 ${pdfInfo?.width} ${pdfInfo?.height}`}
								>
									{pdf.ocr[pageNumber - 1].map((row, index) => {
										return row.map((cell) => {
											if (!cell || !pdfInfo) return <></>;

											return cell.children?.map((child, index) => {
												if (!child) return <></>;
												if (!child.Geometry) return <></>;
												const coords = child.Geometry.Polygon;
												const pdfWidth = pdfInfo.width;
												const pdfHeight = pdfInfo.height;
												const points = coords.map((coord: any) => {
													return `${coord.X * pdfWidth},${coord.Y * pdfHeight}`;
												});
												if (index === cell.children?.length - 1) {
													// Add a second polygon for checkbox aside last polygon of a cell of size 10px x 10px
													return (
														<>
															<polygon
																points={points.join(' ')}
																fill='rgba(0,0,0,0.3)'
															/>
														</>
													);
												}
												return (
													<polygon
														points={points.join(' ')}
														fill='rgba(0,0,0,0.3)'
													/>
												);
											});
										});
									})}
								</svg>
								<div className='file-info fixed gap-2 justify-center   flex text-center bottom-[.5rem] p-2 opacity-0   transition-all text-sm'>
									<button
										onClick={(e) =>
											setPageNumber(
												pageNumber !== 1 ? pageNumber - 1 : pageNumber,
											)
										}
										disabled={pageNumber === 1}
										className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
									>
										<svg
											viewBox='0 0 492.004 492.004'
											className='w-4 h-4 rotate-180'
										>
											<path
												d='M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
			c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
			c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
			c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z'
												fill='#000000'
												data-original='#000000'
											/>
										</svg>
									</button>
									<button
										onClick={(e) =>
											setPageNumber(
												pdf.ocr.length !== pageNumber
													? pageNumber + 1
													: pageNumber,
											)
										}
										className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
										disabled={pdf.ocr.length === pageNumber}
									>
										<svg viewBox='0 0 492.004 492.004' className='w-4 h-4 '>
											<path
												d='M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12
			c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028
			c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265
			c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z'
												fill='#000000'
												data-original='#000000'
											/>
										</svg>
									</button>
								</div>
								<div className='file-info fixed gap-2 justify-center  flex text-center top-[1rem] p-2 opacity-0   transition-all text-sm'>
									<button
										onClick={(e) => setScale(scale !== 1 ? scale - 0.1 : scale)}
										className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
										disabled={scale === 1}
									>
										<svg viewBox='0 0 227.406 227.406' className='w-6 h-6'>
											<g>
												<path
													d='m217.575 214.708-65.188-67.793c16.139-15.55 26.209-37.356 26.209-61.485C178.596 38.323 140.272 0 93.167 0 46.06 0 7.737 38.323 7.737 85.43c0 47.106 38.323 85.43 85.43 85.43 17.574 0 33.922-5.339 47.518-14.473l66.078 68.718a7.482 7.482 0 0 0 5.407 2.302 7.5 7.5 0 0 0 5.405-12.699zM22.737 85.43c0-38.835 31.595-70.43 70.43-70.43 38.835 0 70.429 31.595 70.429 70.43s-31.594 70.43-70.429 70.43c-38.835-.001-70.43-31.595-70.43-70.43z'
													fill='#000002'
												/>
												<path
													d='M131.414 77.93H54.919c-4.143 0-7.5 3.357-7.5 7.5s3.357 7.5 7.5 7.5h76.495c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5z'
													fill='#000002'
												/>
											</g>
										</svg>
									</button>
									<button
										onClick={(e) => setScale(scale < 2 ? scale + 0.1 : scale)}
										className='bg-white shadow-md p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
										disabled={scale >= 2}
									>
										<svg className='w-6 h-6' viewBox='0 0 512 512'>
											<g>
												<path
													d='M289.8 200.2h-49.3v-49.3c0-11.3-9.1-20.4-20.4-20.4-11.3 0-20.4 9.1-20.4 20.4v49.3h-49.3c-11.3 0-20.4 9.1-20.4 20.4 0 11.3 9.1 20.4 20.4 20.4h49.3v49.3c0 11.3 9.1 20.4 20.4 20.4 11.3 0 20.4-9.1 20.4-20.4V241h49.3c11.3 0 20.4-9.1 20.4-20.4 0-11.3-9.2-20.4-20.4-20.4z'
													fill='#000000'
													data-original='#000000'
												/>
												<path
													d='M220.2 388.7C127.3 388.7 52 313.5 52 220.6S127.3 52.5 220.2 52.5s168.1 75.3 168.1 168.1S313 388.7 220.2 388.7zm274.8 78L381.7 353.4c29.7-36.1 47.6-82.4 47.6-132.8 0-115.5-93.6-209.2-209.2-209.2S11 105.1 11 220.6s93.6 209.2 209.2 209.2c50.4 0 96.6-17.8 132.7-47.5l113.3 113.3c5.2 5.3 21.1 7.9 28.9 0 7.9-8 7.9-20.9-.1-28.9z'
													fill='#000000'
													data-original='#000000'
												/>
											</g>
										</svg>
									</button>
								</div>
								<button
									className='fixed top-[1rem] right-[1rem] h-[2rem] w-[2rem] rounded-full flex justify-center items-center shadow-md  transition-all bg-white'
									onClick={(e) => {
										setShowPopUp(false);
									}}
								>
									<svg viewBox='0 0 512 512' className='h-6 w-6'>
										<g>
											<path
												d='M256 512C114.84 512 0 397.16 0 256S114.84 0 256 0s256 114.84 256 256-114.84 256-256 256zm0-475.43C135.008 36.57 36.57 135.008 36.57 256S135.008 475.43 256 475.43 475.43 376.992 475.43 256 376.992 36.57 256 36.57zm0 0'
												fill='#000000'
											/>
											<path
												d='M347.43 365.715c-4.68 0-9.36-1.785-12.93-5.36L151.645 177.5c-7.145-7.145-7.145-18.715 0-25.855 7.14-7.141 18.714-7.145 25.855 0L360.355 334.5c7.145 7.145 7.145 18.715 0 25.855a18.207 18.207 0 0 1-12.925 5.36zm0 0'
												fill='#000000'
											/>
											<path
												d='M164.57 365.715c-4.68 0-9.355-1.785-12.925-5.36-7.145-7.14-7.145-18.714 0-25.855L334.5 151.645c7.145-7.145 18.715-7.145 25.855 0 7.141 7.14 7.145 18.714 0 25.855L177.5 360.355a18.216 18.216 0 0 1-12.93 5.36zm0 0'
												fill='#000000'
											/>
										</g>
									</svg>
								</button>
							</div>
						</div>
					</PopUp>
				)}
				<div
					className='grid grid-cols-[10%_50%_20%_20%] overflow-scroll w-[50vw]  border border-gray-300'
					style={{
						height: 700,
					}}
				>
					<span
						className={`text-sm border-b border-l border-gray-300 p-2 font-bold`}
					>
						Roll No.
					</span>
					<span
						className={`text-sm border-b border-l border-gray-300 p-2 font-bold`}
					>
						Student Name
					</span>
					<span
						className={`text-sm border-b border-l border-gray-300 p-2 font-bold`}
					>
						Enrollment No.
					</span>
					<span
						className={`text-sm border-b border-l border-gray-300 p-2 font-bold`}
					>
						Present/Absent
					</span>
					{pdf.ocr[pageNumber - 1].map((row, rowIndex) => {
						if (!row) return <></>;
						if (!Boolean(row[0]?.Text.match(/[0-9]/g))) return <></>;
						return row.map((cell, cellIndex) => {
							if (!cell)
								return (
									<span
										className={`text-sm border-b border-l  border-gray-300 p-2 text-center  `}
									></span>
								);
							if (cellIndex === row.length - 1) {
								return (
									<span
										className={`text-sm border-b border-l  border-gray-300 p-2 text-center user-select-none cursor-pointer hover:bg-gray-200  `}
										onClick={() => {
											dispatch(
												updateOCR({
													page: pageNumber - 1,
													row: rowIndex,
													column: cellIndex,
													text: cell.Text === 'PRESENT' ? 'ABSENT' : 'PRESENT',
												}),
											);
										}}
									>
										{cell.Text}
									</span>
								);
							}
							return (
								<span
									className={`text-sm border-b border-l  border-gray-300 p-2`}
								>
									{cell.Text}
								</span>
							);
						});
					})}
				</div>
			</div>
			<div className='flex justify-center gap-4'>
				<button onClick={createExel} className='btn'>
					Create Excel
				</button>
			</div>
		</div>
	);
};

export default OCRPDF;
