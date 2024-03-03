"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Title,
  Text,
  Center,
  Tooltip,
  Flex,
  Button,
} from "@mantine/core";
import "./page.css";
import {
  IconAt,
  IconPhoneCall,
  IconStar,
  IconTrash,
  IconUserMinus,
  IconUserPlus,
  IconWorld,
} from "@tabler/icons-react";
import { getUsers } from "./service/userService";
import { AppLevelConstants } from "./constants/appConstants";

export default function HomePage() {
  // State to hold user data
  const [usersData, setUsersData] = useState<any[]>();

  // State to manage the follow status for each user
  const [followStatus, setFollowStatus] = useState<number[]>([]);

  // Effect to fetch user data when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to fetch user data from the API that provided in assignment document
  const fetchUserData = async () => {
    try {
      const users = await getUsers();
      setUsersData(users);
    } catch (error) {
      //Inserted fake data from conststas in case the api fails
      setUsersData(AppLevelConstants.dummyUsersData);
      console.log(error);
    }
  };

  // Function to handle follow user
  const handleFollow = (id: number) => {
    setFollowStatus((prevFollowStatus) => [...prevFollowStatus, id]);
  };

  // Function to handle unfollow user
  const handleUnfollow = (id: number) => {
    setFollowStatus((prevFollowStatus) =>
      prevFollowStatus?.filter((userId) => userId !== id)
    );
  };

  // Function to handle user deletion
  const handleDelete = (id: number) => {
    setUsersData((prevUsersData) =>
      prevUsersData?.filter((userData) => userData.id !== id)
    );
  };

  // Function to handle email, phone and website redirection
  const handleOpenLink = (value: string) => {
    const emailRegex = AppLevelConstants.regex.emailRegex;
    const phoneRegex = AppLevelConstants.regex.phoneRegex;

    if (emailRegex.test(value)) {
      window.open(`${AppLevelConstants.linkPrefix.emailPrefix}${value}`);
    } else if (phoneRegex.test(value)) {
      window.open(`${AppLevelConstants.linkPrefix.telPrefix}${value}`);
    } else {
      window.open(`${AppLevelConstants.linkPrefix.httpPrefix}${value}`);
    }
  };

  return (
    <div className="card-container">
      {usersData?.map((userData) => (
        <Card
          key={userData.id}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className="card"
        >
          <Center>
            <Tooltip label={userData.name} withArrow>
              <Avatar
                component="a"
                href={`${AppLevelConstants.linkPrefix.httpPrefix}${userData.website}`}
                target="_blank"
                src={`${AppLevelConstants.userNameLink}${userData.name}`}
                className="avatar"
              />
            </Tooltip>
          </Center>

          <Center>
            <Title className="user-name" size="lg" fw={500}>
              {userData.name}
              {followStatus.includes(userData.id) && (
                <IconStar className="star-icon" />
              )}
            </Title>
          </Center>

          <Text
            className="card-text"
            onClick={() => handleOpenLink(userData.email)}
          >
            <IconAt className="at-icon" /> {userData.email}
          </Text>

          <Text
            className="card-text"
            onClick={() => handleOpenLink(userData.phone)}
          >
            <IconPhoneCall className="at-icon" /> {userData.phone}
          </Text>

          <Text
            className="card-text"
            onClick={() => handleOpenLink(userData.website)}
          >
            <IconWorld className="at-icon" /> {userData.website}
          </Text>

          <Flex className="action-button-container" justify="space-between">
            {followStatus.includes(userData.id) ? (
              <Button
                className="unfollow-button"
                leftSection={<IconUserMinus size={16} />}
                variant="default"
                onClick={() => handleUnfollow(userData.id)}
              >
                Unfollow
              </Button>
            ) : (
              <Button
                className="follow-button"
                leftSection={<IconUserPlus size={16} />}
                onClick={() => handleFollow(userData.id)}
              >
                Follow
              </Button>
            )}
            <Button
              className="delete-button"
              leftSection={<IconTrash size={16} />}
              variant="default"
              onClick={() => handleDelete(userData.id)}
            >
              Delete
            </Button>
          </Flex>
        </Card>
      ))}
    </div>
  );
}
