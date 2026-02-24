import { RotateCcw } from 'lucide-react'
import styles from '../../pages/navbar/Navbar.module.scss'


type ResetFilterProps = {
    resetFunc: () => void;
};

function ResetFilterBtn({ resetFunc }: ResetFilterProps) {
    return (<button
        className={`${styles.filter_container__location_reset_btn} flex justify-center items-center cursor-pointer`}
        onClick={resetFunc}
    >
        <RotateCcw />
    </button>)
}

export default ResetFilterBtn