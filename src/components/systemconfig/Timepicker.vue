<template>
    <TimePicker :value="time" format="HH:mm:ss" type="timerange"
        placeholder="Select time" style="width: 168px">
     </TimePicker>
</template>
<script>
export default {
    name: 'Timepicker',
    props:['time']
}
</script>