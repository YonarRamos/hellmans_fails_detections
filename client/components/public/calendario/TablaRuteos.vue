<template>
  <div>
    <v-data-table :headers="headers" :items="ruteos" class="elevation-1" disable-initial-sort>
      <template slot="items" slot-scope="props">
        <tr class="text-xs-left">
          <td style="font-size: 10px;">
            <strong class="blue-grey--text">{{ getFormatDate(props.item.fecha) }}</strong>
          </td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.linea ? props.item.linea.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.colector ? props.item.colector.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.tolva ? props.item.tolva.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.molino ? props.item.molino.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.premix ? props.item.premix.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.tk_pasta ? props.item.tk_pasta.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.aceite ? props.item.aceite.nombre : ''}}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.fase_acida ? props.item.fase_acida.nombre : ''}}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.esm ? props.item.esm.nombre : '' }}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.cooker ? props.item.cooker.nombre : ''}}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.tk_slurry ? props.item.tk_slurry.nombre : ''}}</td>
          <td
            class="text-xs-right"
            style="font-size: 10px;"
          >{{ props.item.ketchup ? props.item.ketchup.nombre : ''}}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import axios from '@/plugins/axios'
export default {
  props: {
    ruteos: Array
  },
  data: () => ({
    items: [],
    headers: [
      { text: 'Fecha y hora', value: 'DateTime' },
      { text: 'Linea', value: 'Linea' },
      { text: 'Colector', value: 'Colector' },
      { text: 'Tolva', value: 'Tolva' },
      { text: 'Molino', value: 'Molino' },
      { text: 'Premix', value: 'Premix' },
      { text: 'Pasta', value: 'Pasta' },
      { text: 'Aceite', value: 'Aceite' },
      { text: 'Fase Acida', value: 'FaseAcida' },
      { text: 'ESM', value: 'ESM' },
      { text: 'Cooker', value: 'Cooker' },
      { text: 'Slurry', value: 'Slurry' },
      { text: 'Ketchup', value: 'Ketchup' }
    ]
  }),

  methods: {
    getFormatDate(date) {
      return moment(date)
        .add(3, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
