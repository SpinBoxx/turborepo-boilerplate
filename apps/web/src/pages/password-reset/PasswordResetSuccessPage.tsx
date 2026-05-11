import PasswordResetStateCard from "@/auth/components/PasswordResetStateCard";

export default function PasswordResetSuccessPage({
	redirectTo,
}: {
	redirectTo?: string;
}) {
	return <PasswordResetStateCard redirectTo={redirectTo} state="success" />;
}
