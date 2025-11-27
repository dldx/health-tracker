<script lang="ts">
	import { TrendingUp } from "lucide-svelte";
	import { i18n } from "$lib/i18n";

	interface TrendPoint {
		date: string;
		avgSeverity: number | null;
	}

	interface Props {
		trend: TrendPoint[];
		monthDates: string[];
	}

	let { trend, monthDates }: Props = $props();

	function getPoints(): { x: number; y: number; value: number }[] {
		const points: { x: number; y: number; value: number }[] = [];
		const width = 100;
		const height = 40;

		trend.forEach((d, i) => {
			if (d.avgSeverity !== null) {
				const x = (i / Math.max(trend.length - 1, 1)) * width;
				// Scale 0-5 instead of 1-5
				const y = height - (d.avgSeverity / 5) * height;
				points.push({ x, y, value: d.avgSeverity });
			}
		});
		return points;
	}

	function getMondayTicks(): number[] {
		const ticks: number[] = [];
		const width = 100;

		monthDates.forEach((date, i) => {
			const d = new Date(date + "T00:00:00");
			if (d.getDay() === 1) {
				// Monday
				const x = (i / Math.max(monthDates.length - 1, 1)) * width;
				ticks.push(x);
			}
		});
		return ticks;
	}

	function getSmoothPath(points: { x: number; y: number }[]): string {
		if (points.length < 2) return "";

		const first = points[0];
		let path = `M ${first.x},${first.y}`;

		for (let i = 0; i < points.length - 1; i++) {
			const current = points[i];
			const next = points[i + 1];

			// Simple smoothing: control points at 1/3 and 2/3
			const cp1x = current.x + (next.x - current.x) / 3;
			const cp1y = current.y;
			const cp2x = current.x + (2 * (next.x - current.x)) / 3;
			const cp2y = next.y;

			path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
		}

		return path;
	}

	function getSeverityPath(): string {
		const points = getPoints();
		return getSmoothPath(points);
	}

	function getSeverityAreaPath(): string {
		const points = getPoints();
		if (points.length < 2) return "";

		const linePath = getSmoothPath(points);
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

	<div
		class="relative bg-linear-to-b from-cream-200 to-jade-50 p-3 border border-jade-100 rounded-lg h-24"
	>
		<!-- Severity labels -->
		<div
			class="top-2 bottom-2 left-1 absolute flex flex-col justify-between text-[10px] text-charcoal-400"
		>
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
			<line
				x1="0"
				y1="0"
				x2="100"
				y2="0"
				class="stroke-jade-200/50"
				stroke-width="0.5"
			/>
			<line
				x1="0"
				y1="10"
				x2="100"
				y2="10"
				class="stroke-jade-200/30"
				stroke-width="0.5"
				stroke-dasharray="2 2"
			/>
			<line
				x1="0"
				y1="20"
				x2="100"
				y2="20"
				class="stroke-jade-200/50"
				stroke-width="0.5"
			/>
			<line
				x1="0"
				y1="30"
				x2="100"
				y2="30"
				class="stroke-jade-200/30"
				stroke-width="0.5"
				stroke-dasharray="2 2"
			/>
			<line
				x1="0"
				y1="40"
				x2="100"
				y2="40"
				class="stroke-jade-200/50"
				stroke-width="0.5"
			/>

			<!-- Vertical grid lines (Mondays) -->
			{#each getMondayTicks() as x}
				<line
					x1={x}
					y1="0"
					x2={x}
					y2="40"
					class="stroke-jade-200/30"
					stroke-width="0.5"
					stroke-dasharray="2 2"
				/>
			{/each}

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
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{/if}

			<defs>
				<linearGradient
					id="severityGradient"
					x1="0"
					y1="0"
					x2="0"
					y2="1"
				>
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
