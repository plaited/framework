import { Plait, RulesFunc, TriggerFunc, Listener, Strategy } from '@plaited/plait'
import { noop } from '@plaited/utils'

type Common = {
  strands: Record<string, RulesFunc>
  actions: Record<string, (payload?: any) => void>
  logger?: Listener
  strategy?: Strategy;
}

interface Connected<T = HTMLElement> extends Common {
  connect: (recipient: string, cb: TriggerFunc) => () => void
  context: T extends HTMLElement ? T : HTMLElement
  id?: string
}

interface Isolated extends Common {
  connect: never
  context: never
  id: never
}

export const usePlait = <T = HTMLElement>({
  strands = {},
  actions,
  id,
  connect,
  context,
  logger,
  strategy,
}: Isolated | Connected<T>): { trigger: TriggerFunc, disconnect: () => void} => {
  const { feedback, trigger, stream } = new Plait(strands, { strategy, dev: Boolean(logger) })
  logger && stream.subscribe(logger)
  feedback(actions)
  let disconnect = noop
  if(connect){
    const _id = id || context.tagName.toLowerCase()
    disconnect = connect(id || context.tagName.toLowerCase(), trigger)
    trigger({ eventName: `connected->${_id}` })
  }
  return { trigger, disconnect }
}
