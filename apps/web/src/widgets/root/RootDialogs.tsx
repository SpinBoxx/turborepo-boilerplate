import { getCookie } from "intlayer";
import { isLocaleValid } from "@/features/locale/services/locale";
import LocaleDialog from "@/features/locale/ui/LocaleDialog";

export default function RootDialogs() {
	const localeFromCookie = getCookie("INTLAYER_LOCALE");
	const isLocaleValidFlag = isLocaleValid(localeFromCookie);
	return (
		<div>
			<LocaleDialog isDefaultOpen={!isLocaleValidFlag} />
		</div>
	);
}
