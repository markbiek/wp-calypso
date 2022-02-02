import { Button, Dialog } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import PluginIcon from '../plugin-icon/plugin-icon';
import './style.scss';

interface Props {
	plugin: { name: string; icon: string };
	domains: Array< { isPrimary: boolean; isSubdomain: boolean } >;
	closeDialog: () => void;
	isDialogVisible: boolean;
}

export const PluginCustomDomainDialog = ( {
	plugin,
	domains,
	closeDialog,
	isDialogVisible,
}: Props ): JSX.Element => {
	const translate = useTranslate();

	const hasNonPrimaryCustomDomain = domains.some(
		( { isPrimary, isSubdomain } ) => ! isPrimary && ! isSubdomain
	);

	return (
		<Dialog
			additionalClassNames={ 'plugin-custom-domain-dialog__modal' }
			isVisible={ isDialogVisible }
			onClose={ closeDialog }
		>
			<div className="plugin-custom-domain-dialog__content">
				<div className="plugin-custom-domain-dialog__icon">
					<PluginIcon image={ plugin.icon } />
				</div>
				<div className="plugin-custom-domain-dialog__description">
					{ hasNonPrimaryCustomDomain
						? translate(
								'%(pluginName)s will help you optimize your site around your primary domain. We recommend setting your custom domain as your primary before installing.',
								{
									args: { pluginName: plugin.name },
								}
						  )
						: translate(
								'%(pluginName)s will help you optimize your site around your primary domain. We recommend adding a custom domain before installing.',
								{
									args: { pluginName: plugin.name },
								}
						  ) }
				</div>
				<div className="plugin-custom-domain-dialog__buttons">
					<Button>{ translate( 'Manage domains' ) }</Button>
					<Button primary>
						{ translate( 'Install %(pluginName)s', {
							args: { pluginName: plugin.name },
						} ) }
					</Button>
					<Button plain className="plugin-custom-domain-dialog__learn-more">
						{ translate( 'or learn more' ) }
					</Button>
				</div>
			</div>
		</Dialog>
	);
};
