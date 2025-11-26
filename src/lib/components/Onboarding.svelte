<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { healthStore } from '$lib/stores/health.svelte';
	import { Activity, ShieldCheck, Sparkles, Calendar, Search, BarChart3, ChevronRight, ChevronLeft, Settings2 } from 'lucide-svelte';

	let currentStep = $state(0);
	let nameInput = $state('');
	let direction = $state<'forward' | 'backward'>('forward');

	// Skip personalization step if name is already set (e.g., from URL params)
	const hasNameFromUrl = $derived(!!healthStore.customName);
	const totalSteps = $derived(hasNameFromUrl ? 3 : 4);

	// Check if we're on the last step
	const isLastStep = $derived(currentStep === totalSteps - 1);

	function nextStep() {
		if (currentStep < totalSteps - 1) {
			direction = 'forward';
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			direction = 'backward';
			currentStep--;
		}
	}

	async function completeOnboarding() {
		if (nameInput.trim()) {
			await healthStore.setCustomName(nameInput.trim());
		}
		await healthStore.completeOnboarding();
	}

	async function skipName() {
		await healthStore.completeOnboarding();
	}

	// Animation class based on direction
	const slideClass = $derived(
		direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
	);
</script>

<div class="z-50 fixed inset-0 flex flex-col hk-tile-pattern">
	<!-- Main content area -->
	<div class="flex flex-col flex-1 justify-start items-center px-0 pt-0 pb-8 overflow-hidden">
		<!-- Step content -->
		<div class="{currentStep === 0 ? 'p-0' : 'p-4'} w-full max-w-md">
			{#key currentStep}
				<div class={slideClass}>
					{#if currentStep === 0}
						<!-- Welcome Step -->
						<div class="flex flex-col items-center text-center">
							<!-- Intro graphic - fills top portion -->
								<img
									src="/images/intro.svg"
									alt="Health Tracker illustration"
									class="max-w-full max-h-full object-contain"
								/>

							<div class="space-y-2 mb-4 pt-8 pb-6">
								<h1 class="font-bold text-jade-600 text-5xl neon-glow">
									{i18n.t.onboarding.welcome.title}
								</h1>
								<p class="text-charcoal-400 text-2xl">
									{i18n.t.onboarding.welcome.subtitle}
								</p>
							</div>

							<h2 class="mb-3 font-semibold text-charcoal-600 text-xl">
								{i18n.t.onboarding.welcome.heading}
							</h2>
							<p class="text-charcoal-500">
								{i18n.t.onboarding.welcome.description}
							</p>
						</div>

					{:else if currentStep === 1}
						<!-- Features Step -->
						<div class="flex flex-col items-center text-center">
							<div class="space-y-1 mb-8">
								<h1 class="font-bold text-jade-600 text-2xl neon-glow">
									{i18n.t.onboarding.features.title}
								</h1>
								<p class="text-charcoal-400">
									{i18n.t.onboarding.features.subtitle}
								</p>
							</div>

							<div class="gap-4 grid grid-cols-2 w-full">
								<!-- Track Ailments -->
								<div class="bg-white/90 shadow-sm p-4 border border-jade-200 rounded-xl text-center card-hover">
									<div class="flex justify-center items-center bg-jade-100 mx-auto mb-3 rounded-full w-12 h-12">
										<Activity class="w-6 h-6 text-jade-600" />
									</div>
									<h3 class="mb-1 font-semibold text-charcoal-600 text-sm">
										{i18n.t.onboarding.features.track.title}
									</h3>
									<p class="text-charcoal-400 text-xs">
										{i18n.t.onboarding.features.track.description}
									</p>
								</div>

								<!-- Find Triggers -->
								<div class="bg-white/90 shadow-sm p-4 border border-jade-200 rounded-xl text-center card-hover">
									<div class="flex justify-center items-center bg-coral-100 mx-auto mb-3 rounded-full w-12 h-12">
										<Search class="w-6 h-6 text-coral-500" />
									</div>
									<h3 class="mb-1 font-semibold text-charcoal-600 text-sm">
										{i18n.t.onboarding.features.triggers.title}
									</h3>
									<p class="text-charcoal-400 text-xs">
										{i18n.t.onboarding.features.triggers.description}
									</p>
								</div>

								<!-- Get Insights -->
								<div class="bg-white/90 shadow-sm p-4 border border-jade-200 rounded-xl text-center card-hover">
									<div class="flex justify-center items-center bg-gold-100 mx-auto mb-3 rounded-full w-12 h-12">
										<BarChart3 class="w-6 h-6 text-gold-600" />
									</div>
									<h3 class="mb-1 font-semibold text-charcoal-600 text-sm">
										{i18n.t.onboarding.features.insights.title}
									</h3>
									<p class="text-charcoal-400 text-xs">
										{i18n.t.onboarding.features.insights.description}
									</p>
								</div>

								<!-- Period Tracking -->
								<div class="bg-white/90 shadow-sm p-4 border border-jade-200 rounded-xl text-center card-hover">
									<div class="flex justify-center items-center bg-pink-100 mx-auto mb-3 rounded-full w-12 h-12">
										<Calendar class="w-6 h-6 text-pink-500" />
									</div>
									<h3 class="mb-1 font-semibold text-charcoal-600 text-sm">
										{i18n.t.onboarding.features.period.title}
									</h3>
									<p class="text-charcoal-400 text-xs">
										{i18n.t.onboarding.features.period.description}
									</p>
								</div>
							</div>

							<!-- Customization tip -->
							<div class="flex items-center gap-3 bg-white/90 shadow-sm mt-4 p-3 border border-jade-200 rounded-xl w-full">
								<div class="flex justify-center items-center bg-charcoal-100 rounded-lg w-10 h-10">
									<Settings2 class="w-5 h-5 text-charcoal-500" />
								</div>
								<p class="text-charcoal-500 text-xs text-left">
									{i18n.t.onboarding.features.customize}
								</p>
							</div>
						</div>

					{:else if currentStep === 2}
						<!-- Privacy Step -->
						<div class="flex flex-col items-center text-center">
							<div class="space-y-1 mb-6">
								<h1 class="font-bold text-jade-600 text-2xl neon-glow">
									{i18n.t.onboarding.privacy.title}
								</h1>
								<p class="text-charcoal-400">
									{i18n.t.onboarding.privacy.subtitle}
								</p>
							</div>

							<div class="bg-white/90 shadow-md mb-6 p-6 border border-jade-200 rounded-2xl">
								<div class="flex justify-center items-center bg-jade-100 mx-auto mb-4 rounded-full w-16 h-16">
									<ShieldCheck class="w-8 h-8 text-jade-600" />
								</div>
								<h2 class="mb-2 font-semibold text-charcoal-600 text-lg">
									{i18n.t.onboarding.privacy.heading}
								</h2>
								<p class="mb-6 text-charcoal-500 text-sm">
									{i18n.t.onboarding.privacy.description}
								</p>

								<div class="space-y-3">
									<div class="flex items-center gap-3 bg-jade-50 p-3 rounded-lg">
										<div class="flex justify-center items-center bg-jade-200 rounded-full w-8 h-8">
											<span class="text-base">📱</span>
										</div>
										<span class="font-medium text-charcoal-600 text-sm">
											{i18n.t.onboarding.privacy.localOnly}
										</span>
									</div>
									<div class="flex items-center gap-3 bg-jade-50 p-3 rounded-lg">
										<div class="flex justify-center items-center bg-jade-200 rounded-full w-8 h-8">
											<span class="text-base">🔓</span>
										</div>
										<span class="font-medium text-charcoal-600 text-sm">
											{i18n.t.onboarding.privacy.noAccount}
										</span>
									</div>
									<div class="flex items-center gap-3 bg-jade-50 p-3 rounded-lg">
										<div class="flex justify-center items-center bg-jade-200 rounded-full w-8 h-8">
											<span class="text-base">💾</span>
										</div>
										<span class="font-medium text-charcoal-600 text-sm">
											{i18n.t.onboarding.privacy.exportAnytime}
										</span>
									</div>
								</div>

								{#if hasNameFromUrl}
									<button
										type="button"
										onclick={completeOnboarding}
										class="flex justify-center items-center gap-2 mt-6 w-full btn-primary"
									>
										{i18n.t.onboarding.getStarted}
										<ChevronRight class="w-5 h-5" />
									</button>
								{/if}
							</div>
						</div>

					{:else if currentStep === 3 && !hasNameFromUrl}
						<!-- Personalize Step -->
						<div class="flex flex-col items-center text-center">
							<div class="space-y-1 mb-6">
								<h1 class="font-bold text-jade-600 text-2xl neon-glow">
									{i18n.t.onboarding.personalize.title}
								</h1>
								<p class="text-charcoal-400">
									{i18n.t.onboarding.personalize.subtitle}
								</p>
							</div>

							<div class="bg-white/90 shadow-md mb-6 p-6 border border-jade-200 rounded-2xl w-full">
								<div class="flex justify-center items-center bg-gold-100 mx-auto mb-4 rounded-full w-16 h-16">
									<Sparkles class="w-8 h-8 text-gold-500" />
								</div>
								<h2 class="mb-2 font-semibold text-charcoal-600 text-lg">
									{i18n.t.onboarding.personalize.heading}
								</h2>
								<p class="mb-6 text-charcoal-500 text-sm">
									{i18n.t.onboarding.personalize.description}
								</p>

								<input
									type="text"
									bind:value={nameInput}
									placeholder={i18n.t.onboarding.personalize.placeholder}
									class="mb-4 text-center input"
									maxlength={20}
								/>

								<div class="space-y-3">
									<button
										type="button"
										onclick={completeOnboarding}
										class="flex justify-center items-center gap-2 w-full btn-primary"
									>
										{i18n.t.onboarding.getStarted}
										<ChevronRight class="w-5 h-5" />
									</button>

									<button
										type="button"
										onclick={skipName}
										class="w-full text-charcoal-400 hover:text-charcoal-600 transition-colors"
									>
										{i18n.t.onboarding.personalize.skip}
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>

	<!-- Bottom navigation -->
	<div class="bg-white/80 shadow-lg backdrop-blur-sm px-6 py-2 border-jade-200 border-t">
		<div class="flex justify-between items-center mx-auto max-w-md">
			<!-- Back button -->
			<button
				type="button"
				onclick={prevStep}
				class="flex items-center gap-1 disabled:opacity-0 px-4 py-2 text-charcoal-400 hover:text-charcoal-600 transition-colors"
				disabled={currentStep === 0}
			>
				<ChevronLeft class="w-5 h-5" />
				{i18n.t.onboarding.back}
			</button>

			<!-- Step indicators -->
			<div class="flex gap-2">
				{#each Array(totalSteps) as _, i}
					<div
						class="onboarding-dot"
						class:onboarding-dot-active={i === currentStep}
					></div>
				{/each}
			</div>

			<!-- Next button (hidden on last step since we have Get Started) -->
			{#if !isLastStep}
				<button
					type="button"
					onclick={nextStep}
					class="flex items-center gap-1 bg-jade-400 hover:bg-jade-500 px-4 py-2 rounded-lg font-medium text-white transition-colors"
				>
					{i18n.t.onboarding.next}
					<ChevronRight class="w-5 h-5" />
				</button>
			{:else}
				<div class="w-20"></div>
			{/if}
		</div>
	</div>
</div>

