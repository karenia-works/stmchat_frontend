<template>
	<el-row style="height:500px">
		<div>
			<el-input v-model="input" placeholder="Search"  style="height:35px">
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>
		</div>
		<hr style='border:1.5px inset #FAFAFA;'>
	  <list></list>
	  <list></list>
	  <list></list>
	  <list></list>
  </el-row>
</template>
<script>
export default {
  name: "Usersearch",
  data() {
    return {
      input: '',
    }
  },
}
</script>

<style>
	 .el-input input{
			border:none;
	}
</style>