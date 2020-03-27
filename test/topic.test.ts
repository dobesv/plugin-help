import * as Config from '@oclif/config'
import {expect, test as base} from '@oclif/test'
import stripAnsi = require('strip-ansi')

const g: any = global
g.columns = 80
import Help from '../src'

const test = base
.loadConfig()
.add('help', ctx => new Help(ctx.config))
.register('topicHelp', (topic: Config.Topic) => ({
  run(ctx: {help: Help; commandHelp: string; expectation: string}) {
    const topicHelpOutput = ctx.help.topic(topic)
    if (process.env.TEST_OUTPUT === '1') {
      console.log(topicHelpOutput)
    }
    ctx.commandHelp = stripAnsi(topicHelpOutput).split('\n').map(s => s.trimRight()).join('\n')
    ctx.expectation = 'has topicHelp'
  },
}))

describe('topic help', () => {
  test
  .topicHelp({
    name: 'topic',
    description: 'this is a description of my topic',
    hidden: false,
  })
  .it('shows topic output', ctx => expect(ctx.commandHelp).to.equal(`this is a description of my topic

USAGE
  $ oclif topic:COMMAND
`))

  test
  .topicHelp({
    name: 'topic',
    hidden: false,
  })
  .it('shows topic without a description', ctx => expect(ctx.commandHelp).to.equal(`USAGE
  $ oclif topic:COMMAND
`))

  test
  .topicHelp({
    name: 'topic',
    hidden: false,
    description: 'This is the top level description\nDescription that shows up in the DESCRIPTION section',
  })
  .it('shows topic descriptions split from \\n for top-level and description section descriptions', ctx => expect(ctx.commandHelp).to.equal(`This is the top level description

USAGE
  $ oclif topic:COMMAND

DESCRIPTION
  Description that shows up in the DESCRIPTION section
`))
})
