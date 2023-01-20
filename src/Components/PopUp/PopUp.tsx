import React from 'react';
import './PopUp.scss';

export interface PopUpProps {
	children: React.ReactNode;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	popupProps?: React.HTMLAttributes<HTMLDivElement>;
}

const PopUp: React.FC<PopUpProps> = ({
	children,
	containerProps,
	popupProps,
}) => {
	return (
		<div
			{...containerProps}
			className={`popup__container ${containerProps?.className}`}
		>
			<div {...popupProps} className={`popup ${popupProps?.className}`}>
				{children}
			</div>
		</div>
	);
};

export default PopUp;
