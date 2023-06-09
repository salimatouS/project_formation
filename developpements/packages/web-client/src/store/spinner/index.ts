import { Module } from 'vuex'
import { StateInterface } from '../index'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state, { ISpinnerState } from './state'

const spinnerModule: Module<ISpinnerState, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default spinnerModule
