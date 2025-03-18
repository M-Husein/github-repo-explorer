import { useState, useRef, useEffect } from "react";
import { useDocumentTitle } from "@refinedev/react-router";
import { HttpError, useList, useCreate } from "@refinedev/core";
import { useSearchParams } from "react-router";
import { Collapse, Skeleton, Row, Col, Pagination } from "antd";
import { LinkOutlined, TwitterOutlined } from '@ant-design/icons';
import { BsPeople, BsGeoAlt, BsEnvelope } from 'react-icons/bs';
import { useMode } from "@/contexts/color-mode";
import { FormSearch } from '@/components/FormSearch';
import { ListRepo } from './ListRepo';
import { numShort, parseNumber } from '@/utils';

const appName = import.meta.env.VITE_APP_NAME;
const initUsers = { items: [] };
const renderLoader = () => (
  <div className="mt-4!">
    {[1, 2, 3].map((item: number) => (
      <Skeleton.Button
        key={item}
        active
        block
        size="large"
        className="mb-2"
      />
    ))}
  </div>
);

export default function Page(){
  const [searchParams, setSearchParams] = useSearchParams();
  const searchPayload = searchParams.get('q') || '';
  const current = searchParams.get('current') || 1;
  const pageSize = searchParams.get('pageSize') || 10;

  const { mode } = useMode();
  const { mutate: mutateCreate, isLoading: isLoadingCreate } = useCreate();
  const [users, setUsers] = useState<any>(initUsers);
  const [openUser, setOpenUser] = useState<any>();
  const [searchValue, setSearchValue] = useState<any>(searchPayload);
  const refController: any = useRef();

  useDocumentTitle("Home | " + appName);

  let searchValueTrim = searchPayload.trim();
  let isEnabled = !!current && !!searchValueTrim.length;

  const {
    data: dataSearchResult,
    isLoading,
    isFetching,
    isRefetching,
    isError,
  } = useList<any, HttpError>({
    queryOptions: {
      enabled: isEnabled
    },
    resource: "/search/users", 
    pagination: { current: +current, pageSize: +pageSize },
    meta: { q: searchValueTrim },
  });

  let loadingList = isEnabled && (isLoading || isFetching || isRefetching);

  useEffect(() => {
    if(!isError && dataSearchResult){
      setUsers(dataSearchResult);
    }
  }, [dataSearchResult, isError]);

  const changeSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if(!val && users.items.length){
      setUsers(initUsers);
    }

    setSearchValue(val);
  }

  const doSearch = (val: string | null) => {
    setSearchParams(val?.length ? { q: val, current: '1', pageSize: '' + pageSize } : {}, { replace: true });
    setSearchValue(val);
  }

  const updateUsers = (item: any, profile: any, repos?: any) => {
    setUsers((currentState: any) => ({
      ...currentState,
      items: currentState.items.map((user: any) => {
        if(user.id === item.id){
          return { ...user, profile, repos }
        }
        return user;
      })
    }));
  }

  const clickItem = (e: any, item: any) => {
    let hasOpenUser = openUser === item.id;

    if(!hasOpenUser && e.target.ariaExpanded === 'false'){
      refController.current = new AbortController();

      setOpenUser(item.id);

      mutateCreate({
        resource: "/users/{username}",
        values: {},
        meta: {
          method: "GET",
          username: item.login,
          signal: refController.current.signal
        },
        successNotification: () => false,
      }, {
        onSuccess: (resUser) => {
          let totalRepos = resUser?.data?.public_repos;

          if(totalRepos){
            mutateCreate({
              resource: "/users/{username}/repos",
              values: {},
              meta: {
                method: "GET",
                username: item.login,
                per_page: totalRepos,
                signal: refController.current.signal
              },
              successNotification: () => false,
            }, {
              onSuccess: (resRepos) => {
                if(resRepos?.data){
                  updateUsers(item, resUser.data, resRepos.data);
                }
              }
            })
          }
          else{
            updateUsers(item, resUser.data);
          }
        }
      })
    }
    else{
      if(refController.current){
        refController.current.abort();
        refController.current = null;
        setOpenUser(null);
      }
    }
  }

  const changePagination = (page: number, size: number) => {
    setSearchParams(
      { 
        q: searchPayload,
        current: '' + page, 
        pageSize: '' + size
      },
      { replace: true }
    );
  }

  const parseItem = (item: any) => {
    let isLoadingDetail = isLoadingCreate && openUser === item.id;

    return {
      key: item.id,
      className: "repo-item",
      onClick: (e: any) => clickItem(e, item),
      label: (
        <div className="flex text-lg">
          <img
            width={28}
            alt={item.login}
            src={item.avatar_url}
            className="mr-3 rounded h-7"
          />
          {item.login}
        </div>
      ),
      children: (
        <Row gutter={[16, 16]}>
          <Col lg={7} xs={24} className="p-4!">
            {isLoadingDetail ?
              <div className="text-center">
                <Skeleton.Avatar active shape="square" size={135} className="rounded mb-3" />
                <Skeleton active title={false} />
              </div>
              :
              <div className="sticky top-30 z-10">
                {item.avatar_url && (
                  <img
                    src={item.avatar_url}
                    alt={item.login}
                    width={135}
                    height={135}
                    className="rounded mx-auto mb-3"
                  />
                )}
    
                {!!item?.profile?.name && (
                  <h5 className="text-lg">
                    <a 
                      href={item.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {item.profile.name}
                    </a>
                  </h5>
                )}
                
                <h6 className="text-sm">
                  <a 
                    href={item.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                  >
                    @{item.login}
                  </a>
                </h6>
      
                <hr className="my-4 border-gray-300" />

                {!!item.profile?.bio && <p>{item.profile.bio}</p>}

                {typeof item.profile?.followers === 'number' && (
                  <p>
                    <BsPeople className="mr-2" />
                    {numShort(item.profile.followers)} followers ~ {numShort(item.profile.following)} following
                  </p>
                )}

                {!!item.profile?.location && (
                  <p>
                    <BsGeoAlt className="mr-2" />
                    {item.profile.location}
                  </p>
                )}

                {!!item.profile?.email && (
                  <p>
                    <a href={"mailto:" + item.profile.email}>
                      <BsEnvelope className="mr-2" />
                      {item.profile.email}
                    </a>
                  </p>
                )}
                
                {!!item.profile?.blog && (
                  <p>
                    <a 
                      href={item.profile.blog} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <LinkOutlined className="mr-2" />
                      {item.profile.blog}
                    </a>
                  </p>
                )}

                {!!item.profile?.twitter_username && (
                  <p>
                    <a 
                      href={"https://twitter.com/" + item.profile.twitter_username} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <TwitterOutlined className="mr-2" />
                      @{item.profile.twitter_username}
                    </a>
                  </p>
                )}
              </div>
            }
          </Col>
  
          <Col 
            lg={17} 
            xs={24} 
            className={(mode === 'dark' ? "bg-gray-800" : "bg-gray-50") + " p-4!"}
          >
            {isLoadingDetail ?
              <Skeleton active />
              :
              <ListRepo list={item.repos || []} />
            }
          </Col>
        </Row>
      )
    }
  }

  return (
    <Col 
      lg={16} 
      xs={24} 
      className="mx-auto"
    >
      <Row 
        gutter={[32, 32]} 
        align="middle" 
        className="p-4 content-center max-md:mx-0!"
        style={users.items.length ? {} : { minHeight: 'calc(100vh - 112px)' }}
      >
        <Col lg={6} sm={9} xs={24} className="mx-auto">
          <img 
            alt={appName} 
            src="/media/img/logo-310x310.png"
            className="max-md:w-3/4 rounded-3xl mx-auto mb-1"
          />
          <h1 className="h5 mb-0! text-center">{appName}</h1>
        </Col>

        <Col lg={18} xs={24}>
          <FormSearch
            loading={loadingList}
            value={searchValue}
            onChange={changeSearchInput}
            onSearch={doSearch}
          />
        </Col>
      </Row>

      {loadingList ? 
        renderLoader()
        :
        !!users.items.length && (
          <Collapse
            bordered={false}
            expandIconPosition="end"
            className="mt-4! bg-transparent!"
            items={users.items.map(parseItem)}
          />
        )
      }

      <nav 
        className="my-6 px-4"
        aria-label="Page navigation"
      >
        <Pagination
          className="flex-wrap"
          hideOnSinglePage
          align="center"
          size="small"
          current={+current}
          pageSize={+pageSize}
          total={users.total_count || 0}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${parseNumber(total)} items`}
          onChange={changePagination}
        />
      </nav>
    </Col>
  );
}
