<script lang="ts">
	import { page } from "$app/stores";

	interface Props {
		title?: string;
		description?: string;
		image?: string;
		type?: "website" | "article";
	}

	let {
		title = "ChessNet - Gestión Profesional de Academias de Ajedrez",
		description = "Plataforma completa para gestionar tu academia de ajedrez: alumnos, clases, torneos, pagos y más. Diseñada por y para profesores de ajedrez.",
		image = "https://chess-society.github.io/ChessNet/og-image.png",
		type = "website",
	}: Props = $props();

	const fullTitle = $derived(
		title.includes("ChessNet") ? title : `${title} | ChessNet`,
	);
	const url = $derived($page.url.href);
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="ChessNet" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={url} />
</svelte:head>
