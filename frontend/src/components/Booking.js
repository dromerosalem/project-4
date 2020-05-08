import React from 'react'
import axios from 'axios'
import auth from '../lib/auth'

class Booking extends React.Component {
  constructor() {
    super()
    this.state = {
      data: {
        appointment_date: '',
        services: []
      },
      thiswontbeposted: []
    }
  }

  componentDidMount() {
    const testArray = this.props.location.state.map((serviceObject) => {
      return JSON.parse(serviceObject)
    })

    const servicesArray = []
    testArray.forEach((e) => {
      servicesArray.push(e.id)
    })
    this.setState({ data: { services: servicesArray } })

    this.setState({ thiswontbeposted: testArray })
  }

  handleChange(event) {
    const { name, value } = event.target
    const data = { ...this.state.data, [name]: value }
    this.setState({ data })
  }

  handleSubmit(event) {
    event.preventDefault()

    axios
      .post('/api/appointments/', this.state.data, {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      })
      .then(console.log('POST IS DONE'))
      .then((res) => {
        this.props.history.push('/profile')
      })
      .catch((error) => console.error(error))
  }

  render() {
    console.log(this.state.data)
    const mappedAppointments = this.state.thiswontbeposted

    return (
      <section className="bookingPay">
        <div className="servicesPay">
          <div className="bookedService">
            <h1>Your acquired services below</h1>
            {mappedAppointments.map((elem, index) => {
              return (
                <div key={index++}>
                  <h2>{`${index}  -  ${elem.service_name} - Price - £ ${elem.private_price} `}</h2>
                </div>
              )
            })}
          </div>
          <div className="toPayGroup">
            <div className="toPay">To Pay: £</div>
            <div className="valueToPay">
              {mappedAppointments.reduce((acc, element) => {
                return acc + parseFloat(element.private_price)
              }, 0)}
            </div>
          </div>
          <div className="calendarBook">
            <h1>Set Date & Hour for Booking confirmation √</h1>
            <form onSubmit={(event) => this.handleSubmit(event)}>
              <input
                onChange={(event) => this.handleChange(event)}
                name="appointment_date"
                type="datetime-local"
              />
              <input type="submit" value="Confirm" />
            </form>
          </div>
        </div>
      </section>
    )
  }
}

export default Booking
