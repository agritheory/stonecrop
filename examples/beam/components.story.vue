<template>
	<Story title="Components">
		<Variant title="Split Column">
			<SplitColumn align-items="flex-start">
				<template #left>
					<BeamHeading> WO#2024-01-00001 <span class="beam--normal">Ambrosia Pie</span> </BeamHeading>
					<p class="beam_copy">
						Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget,
						officia doloribus modi nullam.
					</p>
				</template>
				<template #right>
					<ItemCount denominator="10" model-value="5" />
				</template>
			</SplitColumn>
			<hr />
			<SplitColumn>
				<template #left>
					<p class="beam_copy">
						Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget,
						officia doloribus modi nullam.
					</p>
				</template>
				<template #right>
					<p class="beam_copy" style="text-align: left">
						Sapien lobortis cupidatat quis viverra ipsam perspiciatis montes dicta nascetur sit debitis vitae eget,
						officia doloribus modi nullam.
					</p>
				</template>
			</SplitColumn>
		</Variant>
		<Variant title="Arrow">
			<BeamArrow />
			<hr />
			<div style="display: flex; flex-direction: row; gap: 1rem; justify-content: space-between">
				<p class="beam_copy" style="flex-basis: 100%">
					Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque sapiente anim
					posuere aliquip, cupidatat, modi rem!
				</p>

				<BeamArrow style="flex-basis: 100%" />
				<p class="beam_copy" style="flex-basis: 100%">
					Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque sapiente anim
					posuere aliquip, cupidatat, modi rem!
				</p>
			</div>
		</Variant>
		<Variant title="Text Elements">
			<BeamHeading>
				This is the Beam Heading. <span class="beam--normal">And this should not be bold.</span></BeamHeading
			>
			<p class="beam_copy">This is standard copy. <span class="beam--bold">And this is bold.</span></p>
			<p class="beam_copy beam--alert">This is an alert!</p>
			<p class="beam_copy">
				Here is long text. Luctus condimentum repudiandae! Ex enim quas quis metus faucibus felis hic sodales natoque
				sapiente anim posuere aliquip, cupidatat, modi rem! Adipisci conubia quaerat sint? Consequat dolores nam impedit
				id pariatur earum ultricies hic, consequatur qui! Nemo! Donec sagittis a! Accumsan! Aperiam impedit, quidem elit
				aut, facere, minim dignissim conubia blanditiis doloribus ex montes vitae exercitation.
			</p>
		</Variant>
		<Variant title="Btn">
			<BeamBtn>Click</BeamBtn>
		</Variant>
		<Variant title="Progress Block">
			<BeamProgress :complete="workOrder.complete" />
		</Variant>
	</Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const workOrder = reactive({
	complete: false,
})
</script>

<style>
@import url('@stonecrop/beam/styles');
</style>
