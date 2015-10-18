class Action {
  constructor (actionStream) {
    this.actionStream = actionStream
  }

  dispatch (params) {
    this.actionStream.onNext({params, action: this})
  }

  get observable () {
    return this.actionStream.filter(x => x.action === this).pluck('params')
  }
}

exports.Action = Action
