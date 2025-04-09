import Chip from '@mui/material/Chip';
import { getStatusColor } from '../../utils/getStatusColor';
export const ColorChipsUser = ({text}) => {
  return (
    <>
      <Chip label={text? "เปิดใช้งาน" : "ปิดใช้งาน"} color={text ? "success" : "error"} sx={{width:"100px"}}/>
    </>
  )
}

export const ColorChipsEquipment =({statusName })=>{

  return <Chip label={statusName} color={getStatusColor(statusName)} sx={{width:"120px"}} />;
}


