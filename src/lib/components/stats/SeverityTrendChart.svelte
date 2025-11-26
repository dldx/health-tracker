<script lang="ts">
	import { TrendingUp } from 'lucide-svelte';
	import { i18n } from '$lib/i18n';

	interface TrendPoint {
		date: string;
		avgSeverity: number | null;
	}

	interface Props {
		trend: TrendPoint[];
		monthDates: string[];
	}

	let { trend, monthDates }: Props = $props();

	function getSeverityPath(): string {
		const points: { x: number; y: number }[] = [];
		const width = 100;
		const height = 40;

		trend.forEach((d, i) => {
			if (d.avgSeverity !== null) {
				const x = (i / Math.max(trend.length - 1, 1)) * width;
				const y = height - ((d.avgSeverity - 1) / 4) * height;
				points.push({ x, y });
			}
		});

		if (points.length < 2) return '';

		return points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
	}

	function getSeverityAreaPath(): string {
		const points: { x: number; y: number }[] = [];
		const width = 100;
		const height = 40;

		trend.forEach((d, i) => {
			if (d.avgSeverity !== null) {
				const x = (i / Math.max(trend.length - 1, 1)) * width;
				const y = height - ((d.avgSeverity - 1) / 4) * height;
				points.push({ x, y });
			}
		});

		if (points.length < 2) return '';

		const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');
		return `${linePath} L ${points[points.length - 1].x},${40} L ${points[0].x},${40} Z`;
	}
</script>

<section class="p-4 card">
	<div class="flex items-center gap-2 mb-4">
		<TrendingUp class="w-4 h-4 text-jade-500" />
		<h2 class="font-semibold text-charcoal-600 text-sm">
			{i18n.t.stats.severityTrend}
		</h2>
	</div>

	<div class="relative bg-linear-to-b from-cream-200 to-jade-50 p-3 border border-jade-100 rounded-lg h-24">
		<!-- Severity labels -->
		<div class="top-2 bottom-2 left-1 absolute flex flex-col justify-between text-[10px] text-charcoal-400">
			<span>5</span>
			<span>3</span>
			<span>1</span>
		</div>

		<!-- Chart area -->
		<svg
			viewBox="0 0 100 40"
			class="ml-4 w-full h-full"
			preserveAspectRatio="none"
			style="overflow: visible;"
		>
			<!-- Grid lines -->
			<line x1="0" y1="0" x2="100" y2="0" class="stroke-jade-200" stroke-width="0.5" />
			<line x1="0" y1="20" x2="100" y2="20" class="stroke-jade-200" stroke-width="0.5" />
			<line x1="0" y1="40" x2="100" y2="40" class="stroke-jade-200" stroke-width="0.5" />

			<!-- Area fill -->
			{#if getSeverityAreaPath()}
				<path
					d={getSeverityAreaPath()}
					fill="url(#severityGradient)"
					opacity="0.4"
				/>
			{/if}

			<!-- Line -->
			{#if getSeverityPath()}
				<path
					d={getSeverityPath()}
					fill="none"
					class="stroke-coral-400"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/if}

			<defs>
				<linearGradient id="severityGradient" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stop-color="var(--color-coral-400)" />
					<stop offset="100%" stop-color="var(--color-jade-400)" />
				</linearGradient>
			</defs>
		</svg>
	</div>

	<!-- Date range labels -->
	<div class="flex justify-between mt-2 px-4 text-[10px] text-charcoal-400">
		<span>{monthDates[0]?.slice(-2)}</span>
		<span>{monthDates[Math.floor(monthDates.length / 2)]?.slice(-2)}</span>
		<span>{monthDates[monthDates.length - 1]?.slice(-2)}</span>
	</div>
</section>

