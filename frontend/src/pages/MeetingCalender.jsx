import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../providers/userContext';
import Calender from '../components/Calender';

const { ethereum } = window;

const MeetingCalender = () => {
	const { account } = useContext(UserContext);

	return <div>{account && <Calender account={account} />}</div>;
};

export default MeetingCalender;
