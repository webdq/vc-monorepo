export const setPropertyDescriptor = (
  instance: any,
  name: string,
  value: any
) => {
  const privateName = `_${name}`
  const subscriptionName = `_${name}Subscription`
  const oldValue = instance[privateName]
  const subscription = instance[subscriptionName]
  if (subscription) {
    subscription()
    instance[subscriptionName] = undefined
  }
  const hasValue = value !== undefined
  if (hasValue && (!value || !value.getValue)) {
    value = new Cesium.ConstantProperty(value)
  }
  if (oldValue !== value) {
    instance[privateName] = value
    instance._definitionChanged.raiseEvent(instance, name, value, oldValue)
  }
  if (value && value.definitionChanged) {
    instance[subscriptionName] = value.definitionChanged.addEventListener(
      function () {
        instance._definitionChanged.raiseEvent(instance, name, value, value)
      },
      instance
    )
  }
}
