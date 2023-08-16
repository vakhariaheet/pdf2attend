//* Package Import
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//* File Import
import { fileSizeCalculator } from '../../utils/file';
import ApiService from '../../utils/ApiService';
import { clearPDF, setOCR, setPDF } from '../../Slices/Pdf.slice';
import { Document, Page } from 'react-pdf/dist/esm/entry.vite';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './GetPDF.scss';
import PDFLoading from '../../Components/PDFLoading/PDFLoading';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { IRoot, OCRResponse } from '../../types';

export interface GetPDFProps {}

const socket = io(import.meta.env.VITE_API_URL as string);
const GetPDF: React.FC<GetPDFProps> = () => {
	const [file, setFile] = useState<File | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [fileOverDropZone, setFileOverDropZone] = useState<boolean>(false);
	const [logs, setLogs] = useState<string[]>([]);
	const fileName = useSelector<IRoot>((state) => state.pdf.fileName);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const onUpload = async () => {
		if (!file) return;
		if (fileSizeCalculator(file.size) > 50) {
			setErrorMessage('File size is too large');
			return;
		}
		const formData = new FormData();
		formData.append('file', file);

		const { data } = await ApiService.post<{
			message: string;
			url: string;
			name: string;
		}>('upload', formData);
		dispatch(
			setPDF({
				url: data.url,
				name: data.name,
			}),
		);
		socket?.emit('init', {
			name: data.name,
		});
		socket?.on('log', (log: { data: string }) => {
			setLogs((prev) => [...prev, log.data]);
		});
		socket?.on('result', (data: OCRResponse) => {
			console.log("Hello");
			dispatch(setOCR(data));
			navigate('/pdf-ocr');
		});
		// navigate('/pdf-ocr');
	};
	useEffect(() => {
		dispatch(clearPDF());
	}, []);
	return (
		<div>
			<>
				{!fileName && (
					<div className='flex flex-col items-center'>
						<div className='flex justify-center p-5 w-full'>
							{!file && (
								<label
									className={`h-[500px] w-full rounded-md ${
										fileOverDropZone ? 'bg-slate-200' : 'bg-slate-100'
									} flex items-center justify-center flex-col gap-4 cursor-pointer`}
									htmlFor='file'
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onDragEnter={(e) => {
										e.preventDefault();
										e.stopPropagation();

										setFileOverDropZone(true);
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										const file = e.dataTransfer?.files?.item(0);
										if (file) {
											setFile(file);
										}
									}}
									onDragLeave={(e) => {
										e.preventDefault();
										e.stopPropagation();

										setFileOverDropZone(false);
									}}
								>
									<input
										type='file'
										onChange={(e) => {
											const file = e.target.files?.item(0);
											if (file) {
												setFile(file);
											}
										}}
										accept='application/pdf'
										style={{ display: 'none' }}
										id='file'
									/>
									<svg
										viewBox='0 0 682.66669 682.66669'
										className='h-[4rem] w-[4rem] '
									>
										<g>
											<defs id='defs205'>
												<clipPath
													clipPathUnits='userSpaceOnUse'
													id='clipPath215'
												>
													<path
														d='M 0,512 H 512 V 0 H 0 Z'
														id='path213'
														fill='#000000'
														data-original='#000000'
													/>
												</clipPath>
											</defs>
											<g
												id='g207'
												transform='matrix(1.3333333,0,0,-1.3333333,0,682.66667)'
											>
												<g id='g209'>
													<g id='g211' clipPath='url(#clipPath215)'>
														<g id='g217' transform='translate(79.645,23.5322)'>
															<path
																d='m 0,0 v 0 c 0,-8.854 7.178,-16.032 16.032,-16.032 h 368.742 c 8.855,0 16.033,7.178 16.033,16.032 v 394.166 c 0,4.252 -1.69,8.33 -4.696,11.337 l -70.772,70.769 c -3.007,3.007 -7.085,4.696 -11.337,4.696 H 16.032 C 7.178,480.968 0,473.79 0,464.936 V 208.417'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path219'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g id='g221' transform='translate(392.2744,504.5)'>
															<path
																d='m 0,0 v -80.161 c 0,-4.427 3.589,-8.016 8.016,-8.016 h 80.161'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path223'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g225'
															transform='translate(262.3726,159.5715)'
														>
															<path
																d='M 0,0 H -25.801 V -63.659'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path227'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g229'
															transform='translate(236.5713,128.3447)'
														>
															<path
																d='M 0,0 H 23.751'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path231'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g233'
															transform='translate(162.8975,158.7935)'
														>
															<path
																d='M 0,0 V -61.157'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path235'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g237'
															transform='translate(205.6543,127.7419)'
														>
															<path
																d='m 0,0 c 0,-17.147 -9.517,-30.715 -24.616,-30.979 -5.026,-0.088 -18.014,-0.137 -18.014,-0.137 0,0 -0.081,22.541 -0.081,31.185 0,7.098 -0.046,31.047 -0.046,31.047 h 17.626 C -8.57,31.116 0,17.147 0,0 Z'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path239'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g241'
															transform='translate(95.4448,159.8064)'
														>
															<path
																d='M 0,0 V -64.129'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path243'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g245'
															transform='translate(131.7529,141.7092)'
														>
															<path
																d='m 0,0 c 0,-9.995 -8.457,-18.097 -18.452,-18.097 -4.957,0 -17.732,-0.08 -17.732,-0.08 0,0 -0.08,13.139 -0.08,18.177 0,4.138 -0.044,18.097 -0.044,18.097 h 17.856 C -8.457,18.097 0,9.995 0,0 Z'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path247'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g249'
															transform='translate(190.6577,246.9675)'
														>
															<path
																d='M 0,0 C -26.532,40.961 194.555,78.842 182.161,41.023 163.114,-17.093 19.072,178.701 81.557,175.324 117.696,173.37 27.837,-42.976 0,0 Z'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path251'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
														<g
															id='g253'
															transform='translate(31.5483,223.9355)'
														>
															<path
																d='m 0,0 v -144.29 c 0,-13.282 10.767,-24.049 24.048,-24.049 h 248.5 c 8.855,0 16.033,7.178 16.033,16.033 v 112.225 c 0,8.855 -7.178,16.033 -16.033,16.033 H 24.048 C 10.767,-24.048 0,-13.282 0,0 0,13.281 10.767,24.048 24.048,24.048 h 24.049'
																style={{
																	strokeWidth: 15,
																	strokeLinecap: 'round',
																	strokeLinejoin: 'round',
																	strokeMiterlimit: 10,
																	strokeDasharray: 'none',
																	strokeOpacity: 1,
																}}
																id='path255'
																fill='none'
																stroke='#000000'
																strokeWidth={15}
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeMiterlimit={10}
																strokeDasharray='none'
																data-original='#000000'
															/>
														</g>
													</g>
												</g>
											</g>
										</g>
									</svg>

									<p>Drag and drop your PDF here or </p>

									<p className='text-2xl text-primary border cursor-pointer px-4 py-2 border-primary rounded-md w-max'>
										Select File
									</p>
								</label>
							)}
							{file && (
								<div className=' flex flex-col items-center p-3 relative pdf-container '>
									<Document file={file} loading={<PDFLoading height={500} />}>
										<Page pageNumber={1} height={500} />
									</Document>

									<div className='file-info absolute bg-white shadow-md  text-center bottom-[1rem] p-2 opacity-0   transition-all text-sm'>
										<p>
											{file.name}(
											{fileSizeCalculator(file.size, {
												decimalPlaces: 2,
											})}
											MB){' '}
										</p>
									</div>
									<button
										className='absolute top-[1rem] right-[1rem] h-[2rem] w-[2rem] rounded-full flex justify-center items-center shadow-md  transition-all bg-white'
										onClick={() => setFile(null)}
									>
										<svg viewBox='0 0 512 512' className='h-full w-full'>
											<path
												d='m255.575 476.292c-28.978.054-57.68-5.62-84.458-16.694s-51.103-27.331-71.5785-47.836c-86.0513-86.051-86.0513-226.057 0-312.108 20.4445-20.5595 44.7645-36.8599 71.5515-47.9576 26.786-11.0978 55.508-16.7725 84.503-16.6956 58.95 0 114.37 22.9517 156.036 64.6532 41.684 41.684 64.653 97.103 64.653 156.054s-22.952 114.37-64.653 156.054c-20.479 20.505-44.808 36.762-71.588 47.836-26.781 11.074-55.486 16.747-84.466 16.694zm.018-405.9809c-24.357-.0691-48.485 4.6953-70.987 14.0174s-42.931 23.0165-60.103 40.2895c-35.0103 35.011-54.2898 81.567-54.2898 131.09s19.2795 96.062 54.2898 131.09c72.28 72.28 189.899 72.298 262.162 0 35.01-35.01 54.307-81.567 54.307-131.09s-19.28-96.062-54.307-131.09c-17.173-17.268-37.599-30.9588-60.097-40.2806-22.499-9.3218-46.622-14.0892-70.975-14.0263z'
												fill='#000'
											/>
											<path
												d='m180.677 348.25c-3.495.008-6.914-1.023-9.822-2.961-2.908-1.939-5.175-4.698-6.512-7.927-1.338-3.229-1.685-6.783-1-10.21.686-3.427 2.375-6.573 4.852-9.039l149.804-149.804c1.639-1.639 3.585-2.939 5.727-3.827 2.141-.887 4.437-1.343 6.755-1.343s4.614.456 6.755 1.343c2.142.888 4.088 2.188 5.727 3.827s2.94 3.585 3.827 5.727 1.344 4.437 1.344 6.755-.457 4.614-1.344 6.756c-.887 2.141-2.188 4.087-3.827 5.726l-149.804 149.805c-1.635 1.645-3.58 2.949-5.723 3.837-2.142.888-4.44 1.342-6.759 1.335z'
												fill='#000'
											/>
											<path
												d='m330.491 348.25c-2.319.003-4.615-.453-6.757-1.341-2.143-.887-4.088-2.19-5.725-3.831l-149.805-149.805c-1.639-1.639-2.939-3.585-3.826-5.726-.887-2.142-1.344-4.438-1.344-6.756s.457-4.613 1.344-6.755 2.187-4.088 3.826-5.727c1.64-1.639 3.586-2.939 5.727-3.827 2.142-.887 4.438-1.343 6.756-1.343s4.613.456 6.755 1.343c2.142.888 4.088 2.188 5.727 3.827l149.804 149.804c2.477 2.466 4.166 5.612 4.851 9.039.686 3.427.338 6.981-.999 10.21-1.338 3.229-3.604 5.988-6.512 7.927-2.909 1.938-6.327 2.969-9.822 2.961z'
												fill='#000'
											/>
										</svg>
									</button>
								</div>
							)}
						</div>

						<button className='btn' onClick={onUpload}>
							{' '}
							Upload
						</button>
						{errorMessage && <p>{errorMessage}</p>}
					</div>
				)}
				{fileName && (
					<div className='flex flex-col items-center justify-center p-4 min-h-[57vh]'>
						<p className='text-3xl'>Scanning File ...</p>
						<div className='flex flex-row items-center justify-center'>
							<div className='loader'></div>
						</div>
						<p className='text-2xl mt-6'>Logs</p>
						<div className='logs-container w-1/2 text-center  mt-4 rounded-md  overflow-hidden '>
							{logs.map((log, index) => {
								return (
									<p className='p-2 odd:bg-gray-200' key={index}>
										{log}
									</p>
								);
							})}
						</div>
					</div>
				)}
			</>
		</div>
	);
};

export default GetPDF;
