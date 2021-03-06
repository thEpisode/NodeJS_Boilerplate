/* global Vue, stage, popup, b64, format, time, auth, find, localization, loader, parameters
   notificationService, userService */
window.app = new Vue({
  el: '#vue-app',
  mixins: [
    stage,
    popup,
    b64,
    format,
    time,
    auth,
    find,
    localization,
    loader,
    parameters,
    notificationService,
    userService],
  data: {
    vueBind: {
      model: {
        notifications: [],
        user: {},
        entity: {
          dni: '',
          email: '',
          phone: '',
          password: '',
          firstname: '',
          lastname: '',
          role: { id: 0 }
        }
      }
    },
    issues: {
      '[CODE]': {
        title: '[TITLE]',
        message: '[MESSAGE]'
      }
    }
  },
  mounted () {
    window.context = {
      ...window.context,
      ...{
        identity: this.$cookies.get('user_identity'),
        token: this.$cookies.get('user_session')
      }
    }
  },
  methods: {
    async initializeView () {
      await this.getUser()
      this.getAllNotifications()

      this.checkIssuesMessages()
    },
    async checkIssuesMessages () {
      if (!window.location.queryString || !window.location.queryString.issue) {
        return
      }

      this.showIconPopup(this.issues[window.location.queryString.issue])
    },
    async getUser () {
      const userData = this.$cookies.get('user_data')

      if (userData) {
        this.vueBind.model.user = userData
        return
      }

      const userResponse = await this.services.user.getByParameters({ identity: window.context.identity })

      if (!userResponse || !userResponse.success) {
        this.showDefaultError(userResponse)
        return
      }

      this.$cookies.set('user_data', userResponse.result, '1d', '/')
      this.vueBind.model.user = userResponse.result

      return this.vueBind.model.user
    },
    async getAllNotifications () {
      const entityResponse = await this.services.notification.getByParameters({
        receiver: this.vueBind.model.user.id || window.context.identity || ''
      })

      if (entityResponse && entityResponse.success) {
        this.vueBind.model.notifications = entityResponse.result
      }
    },
    selectRoleOnClick (event, role) {
      if (event) { event.preventDefault() }

      if (!role) {
        this.showError({ title: 'Oops!', message: 'Select a role first' })
        return
      }

      this.vueBind.model.entity.role = role
      this.vueBind.visibility.userRoleIsSelected = true
    },
    async createUserOnClick (event) {
      if (event) { event.preventDefault() }

      if (!this.vueBind.model.entity.identity) {
        this.showError({ message: 'Provide at least an identity' })
        return
      }

      this.vueBind.model.entity.business_id = this.vueBind.model.user.business_id

      const userResult = await this.services.user.create(this.vueBind.model.entity)

      if (!userResult) {
        this.showDefaultError(userResult)
        return
      }

      const popupResponse = await this.showIconPopup({
        title: 'User created!',
        message: 'We have confirmed the creation of the user, can now authenticate and work.',
        type: 'success',
        confirmButtonClass: 'btn-success',
        confirmButtonText: 'Continuar'
      })

      if (popupResponse && popupResponse.value) {
        window.location.assign('/user/list/')
      }
    },
    returnOnClick (event) {
      if (event) { event.preventDefault() }

      window.location.assign('/user/list/')
    }
  }
})
