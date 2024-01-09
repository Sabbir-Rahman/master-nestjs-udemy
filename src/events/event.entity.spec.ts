import { Event } from './event.entity'

test('Event should be initialized through constructor', () => {
  const event = new Event({
    name: 'Event 1',
    description: 'This is event description',
  })

  expect(event).toEqual({
    name: 'Event 1',
    description: 'This is event description',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    event: undefined,
    attendeeCount: undefined,
    attendeeRejected: undefined,
    attendeeMaybe: undefined,
    attendeeAccepted: undefined
  })
})
