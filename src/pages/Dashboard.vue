<template>
  <div>
    <div class="row">
      <div class="col-md-8 col-sm-12">
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
            perPage: 10,
          }">
            <div slot="emptystate">
              <div v-show="isLoading" class="progress-horizontal">
                <div class="bar-horizontal"></div>
              </div>
              <span v-show="!isLoading">
                There are no arbs currently. Check back later 😉
              </span>
            </div>
          </vue-good-table>
        </card>
      </div>
      <div class="col-md-4 col-sm-12">
        <card class="d-none d-md-block card game-info fixed-content">
          <h3 slot="header" class="card-title">Game Info</h3>
          <div v-show="game_info_has_data">
            <h4 style="text-transform: none"><span style="margin-left: 0">{{ game_info.home_team }}</span> Vs	<span>{{ game_info.away_team }}</span></h4>
            <h5>Kick off: <span>{{ game_info.kick_off | formatDate }}</span></h5>
            <h5>Player name: <span>{{ game_info.player_name }}</span></h5>
            <div class="row">
              <div class="col-md-6">
                <h5 class="first-to-upper">{{ game_info.yes_bookie }} (Yes) : <span>{{ game_info.yes_odd }}</span></h5>            
              </div>
              <div class="col-md-6">
                <h5 class="first-to-upper">{{ game_info.no_bookie }} (No) : <span>{{ game_info.no_odd }}</span></h5>
              </div>
            </div> <br>
            <h5>Arb Percentage: <span>{{ game_info.arb_percentage }}</span>%</h5>
          </div>                            
          <p v-show="!game_info_has_data">Click a match on the table to view more info here</p>

        </card>        
      </div>
      <modal name="game-info-dialog"
      :width="300"
      >
        <center>          
          <h3 slot="header" class="card-title">Game Info</h3>
          <div v-show="game_info_has_data">
            <h4 style="text-transform: none"><span style="margin-left: 0">{{ game_info.home_team }}</span> Vs	<span>{{ game_info.away_team }}</span></h4>
            <h5>Kick off: <span>{{ game_info.kick_off | formatDate }}</span></h5>
            <h5>Player name: <span>{{ game_info.player_name }}</span></h5>
            <div class="row">
              <div class="col-md-6">
                <h5 class="first-to-upper">{{ game_info.yes_bookie }} (Yes) : <span>{{ game_info.yes_odd }}</span></h5>            
              </div>
              <div class="col-md-6">
                <h5 class="first-to-upper">{{ game_info.no_bookie }} (No) : <span>{{ game_info.no_odd }}</span></h5>
              </div>
            </div> <br>
            <h5>Arb Percentage: <span>{{ game_info.arb_percentage }}</span>%</h5>
          </div>                            
          <p v-show="!game_info_has_data">Click a match on the table to view more info here</p>
        </center>
      </modal>
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
        isLoading : true,
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
          yes_bookie : '',
          no_bookie : '',
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
        // Make a request for rows
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
        this.game_info.yes_odd = params.row.yes_odd
        this.game_info.no_odd = params.row.no_odd
        this.game_info.yes_bookie = params.row.yes_bookie
        this.game_info.no_bookie = params.row.no_bookie
        this.game_info.arb_percentage = params.row.arb_percent
        this.game_info.kick_off = params.row.start_time

        this.game_info_has_data = true
        if (window.innerWidth < 768) {
          this.$modal.show('game-info-dialog');
        } 
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
      },
      rows(){
        this.isLoading = false
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
.progress-horizontal {
  display: block;
  width: 100%;
  height: 4px;
  margin: 0;
  background-color: rgba(0,0,0,0.34);
  overflow: hidden;
}

.bar-horizontal {
  width: 50%;
  height: 100%;
  margin-left: 0;
  background-color: #3EAA78;
  
  animation-name: spinner;
  animation-duration: 2000ms;
  animation-timing-function: ease-in-out;
  animation-play-state: running;
  animation-direction: normal;
  animation-iteration-count: infinite;
}

@keyframes spinner {
  0% {
    width: 0;
  }
  50% {
    width: 100%;
    margin-left: 50%;
  }
  100% {
    width: 0;
    margin-left: 100%;
  }
}
table.vgt-table{
  font-family: Poppins,sans-serif;
  font-size: .875rem !important;
}
.fixed-content {
    position:sticky ;
    top: 60px;
   
}
.v--modal{
  background-color: #27293D !important;
}
.first-to-upper:first-letter{
  text-transform: uppercase;
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
