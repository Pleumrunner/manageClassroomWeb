import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome style={{ color: '#9F76B4'}}/>,
    cName: 'nav-text'
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: <IoIcons.IoIosPaper style={{ color: '#9F76B4'}}/>,
    cName: 'nav-text'
  },
  // {
  //   title: 'Seatmap',
  //   path: '/seatmap',
  //   icon: <MdIcons.MdEventSeat style={{ color: '#9F76B4'}}/>,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'Attendants',
  //   path: '/attendants',
  //   icon: <BsIcons.BsFillPersonCheckFill style={{ color: '#9F76B4'}}/>,
  //   cName: 'nav-text'
  // },
];