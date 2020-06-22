<template>
	<div v-if="stage">
		<Setgroup @Groupname="Setname"></Setgroup>
	</div>
	<div v-else>
		<Addmember @Groupmem="Dealmember"></Addmember>
	</div>
</template>
<script>
import axios from "axios"
import { serviceProvider , TYPES } from "@/services/dependencyInjection";
import { GroupProfilePool } from "@/services/cachingService";
import Addmember from './Addmember.vue'
import Setgroup from './Setgroup.vue'
export default {
    components: {Addmember,Setgroup},
	data() {
		return {
			stage:true,
			groupname:"",
			owner:"wang",
			groupmember:[],
		};
	},
    methods: {
		Setname(data){
			this.stage=false;
			this.groupname=data;
			console.log(this.groupname);
		},
		Dealmember(data) {
			this.groupmember=data;
			this.groupmember.push(this.owner)
			console.log(this.groupmember);
			this.Creatgroup();
		},
		Creatgroup(){
			let group = serviceProvider.resolve(GroupProfilePool);
			group.makeGroup({
				name:this.groupname,
				id:"",
				isFriend:false,
				members:this.groupmember,
				owner:this.owner,
			});
		},
	},
}
</script>