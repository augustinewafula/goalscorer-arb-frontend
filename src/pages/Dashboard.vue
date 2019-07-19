<template>
  <div>
    <div class="row">
      <div class="col-lg-8 col-md-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <a href="#" @click.prevent="refreshArbs()"><i class="tim-icons icon-refresh-02" :class="refreshingAnimation" style="font-size: 25px; margin-bottom: 10px"></i></a>          
          <vue-good-table
          :columns="columns"
          :rows="rows"
          theme="nocturnal"
          @on-row-click="onRowClick"
          :sort-options="{
            enabled: true,
            initialSortBy: {field: 'arb_percent', type: 'desc'}
          }"
          :search-options="{
            enabled: true
          }"
          :pagination-options="{
            enabled: true,
            perPage: 15,
          }"/>
        </card>
      </div>
      <div class="col-lg-4 col-md-12">
        <card class="card game-info fixed-content">
          <h3 slot="header" class="card-title">Game Info</h3>
          <div v-show="game_info_has_data">
            <h4 style="text-transform: none"><span style="margin-left: 0">{{ game_info.home_team }}</span> Vs	<span>{{ game_info.away_team }}</span></h4>
            <h5>Kick off: <span>{{ game_info.kick_off | formatDate }}</span></h5>
            <h5>Player name: <span>{{ game_info.player_name }}</span></h5>
            <div class="row">
              <div class="col-md-6">
                <h5>Betika (Yes) : <span>{{ game_info.yes_odd }}</span></h5>            
              </div>
              <div class="col-md-6">
                <h5>Betwinner (No) : <span>{{ game_info.no_odd }}</span></h5>
              </div>
            </div> <br>
            <h5>Arb Percentage: <span>{{ game_info.arb_percentage }}</span>%</h5>
          </div>                            
          <p v-show="!game_info_has_data">Click a match on the table to view more info here</p>

        </card>        
      </div>
    </div>
  </div>
</template>
<script>
  import config from '@/config';  
  import axios from 'axios';
  import moment from 'moment';

  export default {
    data() {
      return {
        isRefreshing : false,
        refreshingAnimation : '',
        game_info_has_data : false,
        game_info : {
          home_team : '',
          away_team : '',
          player_name : '',
          kick_off : '',
          yes_odd : '',
          no_odd : '',
          arb_percentage : ''
        },
        columns: [
        {
          label: 'Home Team',
          field: 'home_team',
        },
        {
          label: 'Away Team',
          field: 'away_team',
        },
        {
          label: 'Start Time',
          field: 'start_time',
          type: 'date',
          dateInputFormat: 'YYYYMMDDHHmmss', // expects 2018-03-16
          dateOutputFormat: 'MM/DD/YYYY HH:mm', // outputs Mar 16th 2018
        },
        {
          label: 'Arb Percentage',
          field: 'arb_percent',
          type: 'number',
        },
      ],
      rows: [],
      }
    },
    computed: {
      enableRTL() {
        return this.$route.query.enableRTL;
      },
      isRTL() {
        return this.$rtl.isRTL;
      }
    },
    methods: {
      getArbs () {
        // Make a request for arbs
        axios.get('/arbs')
          .then((response)=>{
            // handle success
            this.rows = response.data
            this.isRefreshing = false
          })
          .catch((error)=>{
            // handle error
            console.log(error);
            this.isRefreshing = false
          })
      },
      refreshArbs () {
        console.log('refreshing...')
        this.isRefreshing = true
        this.getArbs ()

      },
      onRowClick(params) {
        this.game_info.home_team = params.row.home_team
        this.game_info.away_team = params.row.away_team
        this.game_info.player_name = params.row.player_name
        this.game_info.yes_odd = params.row.betika_odd
        this.game_info.no_odd = params.row.betwinner_odd
        this.game_info.arb_percentage = params.row.arb_percent
        this.game_info.kick_off = params.row.start_time

        this.game_info_has_data = true
        // params.row - row object 
        // params.pageIndex - index of this row on the current page.
        // params.selected - if selection is enabled this argument 
        // indicates selected or not
        // params.event - click event
      }      
    },
    filters: {
      formatDate: function (value) {
        return value ? moment(value, "YYYYMMDDHHmmss").format('MMMM Do YYYY, h:mm a') : ''
      }
    },
    watch : {
      isRefreshing(){
        if (this.isRefreshing) {
          this.refreshingAnimation = 'rotating'
        }  else{
          this.refreshingAnimation = ''
        }     
      }
    },
    mounted() {
      this.i18n = this.$i18n;
      if (this.enableRTL) {
        this.i18n.locale = 'ar';
        this.$rtl.enableRTL();
      }
      this.getArbs()
    },
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
table.vgt-table{
  font-family: Poppins,sans-serif;
  font-size: .875rem !important;
}
.fixed-content {
    position:fixed;
    width: 370px;
   
}
</style>

<style scoped>
.game-info span{
  margin-left: 4px;
}
.rotating {
  -webkit-animation: rotation 2s infinite linear;
  animation: rotation 2s infinite linear;
}
@keyframes rotation{
  from {
				-webkit-transform: rotate(0deg);
		}
		to {
				-webkit-transform: rotate(359deg);
		}
}
@-webkit-keyframes rotation {
		from {
				-webkit-transform: rotate(0deg);
		}
		to {
				-webkit-transform: rotate(359deg);
		}
}
</style>
