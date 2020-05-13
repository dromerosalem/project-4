### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive
# Laboratory Appointment Booking System 

## Overview


This project was in teams of 4 a full-stack app. We used React in the front end and Django in the back end. We made a a laboratory appoitment booking system (LABS).
The original of this project was to build a boooking platform for an actual bussines where they will get an MVP demo version to be implmented in the future when will be fully functional

You can launch the site on Heroku [here](https://labs-project4.herokuapp.com/#/) 

## The Brief 

- **Build a full-stack application by making your own backend and your own front-end**
- **Use a Python Django API using Django REST Framework to serve your data from a Postgres database**
- **Consume your API with a separate front-end built with React**  
- **Be a complete product which most likely means multiple relationships and CRUD functionality for at least a couple of models** 
- **Implement thoughtful user stories/wireframes** that are significant enough to help you know which features are core MVP and which you can cut** 
- **Have a visually impressive design to kick your portfolio up a notch and have something to wow future clients & employers. ALLOW time for this**


## The Technologies used 

- Django
- React.js
- Bulma
- JSON
- Babel
- Google Fonts
- SASS
- Heroku
- Webpack
- Git and GitHub
- JavaScript (ES6+)
- HTML5


## The Approach 


We started by defining the data models.

<img  src=frontend/Images/relationships.png height=500> 
 
 As we can observe in the picture above we have four modules with their porperties what will build the relationship betwen them. 

 `categories`, `services` and `appointemnt` are in the apointments app and the `user` is used for the Authorization with jwt library.

 **RELATIONSHIPS**

 User id -----> Appoitments User
    (one to many)

Appointments services ------> Services id
                  (many to many)

 Categories id  -----> Services category
               (one to many )



We did not use any external API as we have created our own fixture file taking advantage of the fact that we could use the Django Framework 229 services provided by the healthcare institution  were hardcoded in the framework and then a fixture file will all the avaliable services, so when we were loading the databases is worth to metion that was done with Postgree SQL database as it was the first time that we have the chance to work during the project with SQL.


<img  src=frontend/Images/PostgreeSQL.png height=500> 

 

## The Backend


**Models**

Beacuse django gives already a user model build in we extend it with aditonal field that were required.

`age`

`phone-number`

Build in fields for the user in django

`email`

`id`

`username`

`firstname`

`lastname`

`password`

`password-confirmation`


example of a User model
```js
class User(AbstractUser):
    age = models.IntegerField(null=True)
    phone_number = models.IntegerField(null=True)
    BUSINESS = 'BA'
    INDIVIDUAL = 'IN'
    USER_TYPE_CHOICES = [
        (BUSINESS, 'Business'),
        (INDIVIDUAL, 'Individual'),
    ]
    user_type = models.CharField(
        max_length=2,
        choices=USER_TYPE_CHOICES,
        default=INDIVIDUAL,
    )

    def __str__(self):
        return self.username

```

we find an aditional field called `User_type` as it was one of the strechgoals of the project what need to be done.


**Serializers**

Each model has their own serializer

`AppointmentSerializer`

`CategorySerializer`

`ServiceSerializer`

`UserSerializer`


```js

class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ('id', 'appointment_date', 'services', 'user')
        extra_kwargs = {
            'services': {'required': False}
        }
```


And then we were building the relationships between them with te following serializers.

`PopulateServiceSerializer`

`PopulateCategorySerializer`

`PopulateAppointmentSerializer`



```js


class PopulateAppointmentSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True)
    user = UserSerializer()

    class Meta:
        model = Appointment
        fields = ('id', 'appointment_date', 'user', 'services')

```

**Views**

We generate different views in order to get the information passed from our serializers previously as a part of our MVC.


`ListView(APIView)`

`DetailView(RetrieveUpdateDestroyAPIView)`

`ServiceListView(ListCreateAPIView)`

`ServiceDetailView(RetrieveUpdateDestroyAPIView)`

`CategoryListView(ListCreateAPIView)`

`CategoryDetailView(RetrieveUpdateDestroyAPIView)`

`UserDetailView(RetrieveUpdateDestroyAPIView)`


As an example we look at ListView what it was the main view we were using in order to get the list of appoitments with their relationship to the user and catergory with theri services.



```js
class ListView(APIView):  # extend the APIView
    permission_classes = (IsAuthenticated, )

    def get(self, _request):
        current_user = request.user.id
        appointment = Appointment.objects.all()
        serializer = PopulateAppointmentSerializer(appointment, many=True)

        return Response(serializer.data)  # send the JSON to the client


```


**The Endpoints**
We had 8 endpoint which can be seeing below. 

```js
    path('', ListView.as_view()),
    path('appointments/', ListView.as_view()),
    path('<int:pk>/', DetailView.as_view()),
    path('services/', ServiceListView.as_view()),
    path('services/<int:pk>/', ServiceDetailView.as_view()),
    path('category/', CategoryListView.as_view()),
    path('category/<int:pk>/', CategoryDetailView.as_view()),
    path('user/<int:pk>/', UserDetailView.as_view()),

```





## The Front-End

It was build using React Classes and Hooks, contains 11 components which we use to constructe the front-end. we will list below and talk about the most relevant.

<img  src=frontend/Images/labs.png height=500>

`Register.js` and `Login.js`

We are building and standard Register and Login form where we will be validating the user with their tokens. 

The information entered by the user in the registration and login forms is set as state and then posted to our backed endpoints through  `/api/register` and `/api/login`. 

`Service.js`, `ServiceCard.js` and `Dropbox.js`


We first have created a `Dropbox.js` component that will be listing the different categories and rendering into the `Service.js`. We created  `hadleDropDown()` funtion which filters the event selected in the `Dropbox.js` if the user selects, 'Search All' it will return all the services, if the user selects one category that catergory is converted to lowecase which matches the event. Hence, returning only the selected category in form a card that is build into the `ServicesCard.js` component.

```js
  componentDidMount() {
    axios
      .get('/api/appointments/category/')
      .then((res) => {
        this.setState({
          category: res.data,
          filteredCategories: res.data
        })
      })
      .catch((error) => console.error(error))
  }

  handleDropdown(event) {
    this.setState({ dropDownOption: event.target.value })

    if (event.target.value === 'Search All') {
      this.setState({ filteredCategories: this.state.category })
    } else {
      const onlyDropdownSelected = this.state.category.filter((service) => {
        if (
          service.category.toLowerCase() === event.target.value.toLowerCase()
        ) {
          return event.target.value
        }
      })
      this.setState({ filteredCategories: onlyDropdownSelected })
    }
  }

  handleChange(event) {
    const choices = this.state.choices

    if (event.target.checked === true) {
      choices.push(event.target.value)
      console.log(choices)
      this.setState({ choices })
    } else {
      const newchoices = choices.filter((choice) => {
        return choice !== event.target.value
      })
      this.setState({ choices: newchoices })
    }
  }


```

`Booking.js`

The state from `Service.js` is passed to `Booking.js` with the previously selected services. 


```js
              <Link
                to={{
                  pathname: '/bookings',
                  state: this.state.choices
                }}

```

As we were passing the state in the form of an array we had to transform it back to an object in order to render all the required information. 


```js
componentDidMount() {
    const testArray = this.props.location.state.map((serviceObject) => {
      return JSON.parse(serviceObject)
    })

```

Once we are getting the information we are mapping through the passed state and redering all the selected services for the booking.

By using a reduce function we are summing the total ammount to be paid 


```js
              {mappedAppointments.reduce((acc, element) => {
                return acc + parseFloat(element.private_price)
              }, 0)}

```


Finally we had to select a time and date for our appoitment, all this will be then posted to our backend endpoint `/api/appointments/`.


```js
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

```

`Profile.js`

Into the profile component we are using React Hooks for learning purposes, where instead of using a `ComponentDidMount()` function to use the get method, now we will be using `useEffect()` fucntion what is build in with the Hooks.

By calling our axios method we are geting the profile information from the logged in user as is working with an authorization token. Will gather just the fields from the user model that is logged-in.

```js
  useEffect(() => {
    axios
      .get('/api/profile', {
        headers: { Authorization: `Bearer ${auth.getToken()}` }
      })
      .then((resp) => {
        setData(resp.data)
        // console.log(data)
      })
      .catch((error) => console.error(error))
  }, [])


```

This component is the last one of the User journey as it will be showing all the appointments for this particular user.

<img  src=frontend/Images/profile.png height=500>


## Challenges

- When trying to pass the state from `Services.js` to `Booking.js` it was challeging due to the fact that we were passing an array of strings and what we actually need it was an object to be passed. We spend several hours in this bit. Later we go to the conclussion that before transforming to an object we must map through this array of string and then user `JSON.parse()` method.

- When building the data modeling at the begining of the project we did'nt consider the ammount of time that will consume to construct such a aplication. So we had to get rid of some functionalities that we wanted to implement in the really begining like different locations for the health care institution where to book the appointment and the implementation of another kind of user as a B2B. So that's why we have created two different user_type in the begining.

- Trying to create the Populate serializers for some of the views was a challenge.   As our models didn’t always have the information required for some of the views that we wanted to create, we had to create populated serializers that would allow us to display the information in the format that we needed.  Getting this correct was not a simple, given the relationships between the between some of the models


 ## Successes

 - I big successes was at the really begining of the project when doing the data modeling we had a clear idea of what we wanted to build so at the moment to make the MVC we did it in a fast and efficient manner. 


 ## Lessons Learned

- Working with Django in order to build our own API was something that I really enjoyed, buidling the data modeling and work with the relationships between them. I understood with that project how powerfull Python it is and in particular the Django framework what I found it user friendly and clear enough when bulding our model schemmas. 

- Passing the state from one component to the other is something I was not expecting to do and I will add it to my skill belt for the future when working with React Components.

- React Hooks was one of the newest tech we had the chance to try. I used in one of the commponents `Profile.js`  to get use to it.



 