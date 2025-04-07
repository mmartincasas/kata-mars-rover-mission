import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import RoverMap from '@/components/RoverMap.vue'
import { nextTick } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { MAX_MAP_VALUE } from '@/constants/map'

const createCommandInput = (overrides = {}) => ({
  x: 1,
  y: 1,
  direction: 'N',
  commands: 'FF',
  ...overrides
})

type RoverMapComponent = ComponentPublicInstance & {
  map: {
    grid: Array<Array<{ isObstacle: boolean }>>
  }
}

describe('RoverMap.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(RoverMap, {
      props: {
        commandInput: null
      }
    })
  })

  it('renders initial map and message', () => {
    expect(wrapper.text()).toContain('Waiting for new commands')
    expect(wrapper.findAll('.border').length).toBeGreaterThan(0)
  })

  it('updates status message when commandInput changes', async () => {
    const vm = wrapper.vm as RoverMapComponent
    vm.map.grid[1][1].isObstacle = false

    wrapper.setProps({ commandInput: createCommandInput() })
    await nextTick()
    expect(wrapper.text()).toContain('Executing commands')
  })

  it('emits status-change event when roverStatus changes', async () => {
    wrapper.setProps({ commandInput: createCommandInput() })
    await new Promise(resolve => setTimeout(resolve, 600))
    expect(wrapper.emitted('status-change')).toBeTruthy()
    const emittedStatuses = wrapper.emitted('status-change')?.map(e => e[0]) || []
    expect(emittedStatuses).toContain('executing')
  })

  it('shows error state when starting on obstacle', async () => {
    const vm = wrapper.vm as RoverMapComponent
    vm.map.grid[1][1].isObstacle = true
    wrapper.setProps({ commandInput: createCommandInput() })
    await nextTick()
    expect(wrapper.text()).toContain('The rover is on an obstacle')
  })

  it('shows error state when rover moves out of bounds', async () => {
    const vm = wrapper.vm as RoverMapComponent
    vm.map.grid[MAX_MAP_VALUE][1].isObstacle = false

    wrapper.setProps({
      commandInput: createCommandInput({
        x: 1,
        y: MAX_MAP_VALUE,
        direction: 'S',
        commands: 'F'
      })
    })

    await new Promise(resolve => setTimeout(resolve, 600))
    expect(wrapper.text()).toContain('Execution aborted: The rover is out of bounds!')
  })

  it('shows error state when rover hits an obstacle during movement', async () => {
    const vm = wrapper.vm as RoverMapComponent
    vm.map.grid[2][1].isObstacle = true
    vm.map.grid[3][1].isObstacle = false

    wrapper.setProps({
      commandInput: createCommandInput({
        x: 1,
        y: 1,
        direction: 'S',
        commands: 'F'
      })
    })

    await new Promise(resolve => setTimeout(resolve, 800))
    expect(wrapper.text()).toContain('Execution aborted: An obstacle is blocking the path!')
  })

  it('shows success state when rover completes all commands without error', async () => {
    const vm = wrapper.vm as RoverMapComponent
    vm.map.grid[2][1].isObstacle = false
    vm.map.grid[3][1].isObstacle = false

    wrapper.setProps({
      commandInput: createCommandInput({
        x: 1,
        y: 1,
        direction: 'S',
        commands: 'FF'
      })
    })

    await new Promise(resolve => setTimeout(resolve, 1200))
    expect(wrapper.text()).toContain('Mission accomplished!')
  })
})
