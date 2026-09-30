const $SoundEvents = Java.loadClass('net.minecraft.sounds.SoundEvents')
const $ParticleTypes = Java.loadClass('net.minecraft.core.particles.ParticleTypes')

StartupEvents.registry('fluid', event => {
  event.create('shimmer')
    .type(type => type
      .renderType(3)
      .stillTexture('kubejs:block/shimmer_fluid_still')
      .flowingTexture('kubejs:block/shimmer_fluid_flow')
      .fallDistanceModifier(0)
      .displayName('液态微光')
    )
})