import styled from '@emotion/styled';
import { ReactNode } from 'react';
import Breadcrumb from 'calypso/components/breadcrumb';

const Header = styled.header`
	position: fixed;
	z-index: 1;
	top: var( --masterbar-height );
	left: calc( var( --sidebar-width-max ) + 1px ); // 1px is the sidebar border.
	width: calc( 100% - var( --sidebar-width-max ) - 1px ); // 1px is the sidebar border.
	padding: 0 32px;
	box-sizing: border-box;
	border-bottom: 1px solid var( --studio-gray-5 );
	background-color: var( --studio-white );

	@media ( max-width: 960px ) {
		// Account for jetpack sites with the old sidebar.
		left: calc( var( --sidebar-width-min ) + 1px ); // 1px is the sidebar border.
		width: calc( 100% - var( --sidebar-width-min ) - 1px ); // 1px is the sidebar border.
	}

	@media ( max-width: 782px ) {
		width: 100%;
		left: 0;
	}

	@media ( max-width: 660px ) {
		padding: 0 16px;
	}
`;

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	min-height: 70px;

	@media ( max-width: 660px ) {
		min-height: 60px;
	}

	.main.is-wide-layout & {
		max-width: 1040px;
		margin: auto;
	}
`;

const ActionsContainer = styled.div`
	display: flex;
	align-items: center;
`;

interface Props {
	id?: string;
	className?: string;
	children?: ReactNode;
	navigationItems: { label: string; href?: string }[];
}

const FixedNavigationHeader: React.FunctionComponent< Props > = ( props ) => {
	const { id, className, children, navigationItems } = props;

	return (
		<Header id={ id } className={ className }>
			<Container>
				<Breadcrumb items={ navigationItems } />
				<ActionsContainer>{ children }</ActionsContainer>
			</Container>
		</Header>
	);
};

FixedNavigationHeader.defaultProps = {
	id: '',
	className: '',
	navigationItems: [],
};

export default FixedNavigationHeader;